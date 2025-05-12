import {users} from '../config/mongoCollections.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import ld from 'lodash';
const saltRounds = 16;
import { usernameValidation, passwordValidation } from '../public/js/validation.js';

const createUser = async (username, password) => {
    if (!username) {
        throw 'Please provide username';
    }
    if (!password) {
        throw 'Please provide password';
    }
    usernameValidation(username);
    passwordValidation(password);
    let usernameLowerCase = username.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({username: usernameLowerCase});
    if (user != null) {
        throw 'User already exists.';
    }
    password = await bcrypt.hash(password, saltRounds);
    let newUser = {
        userPosts: [],
        userEvents: [],
        userLikes: [],
        userComments: [],
        friendsList: [],
        gender: '',
        firstName: 'John',
        lastName: 'Doe',
        city: '',
        state: '',
        age: '',
        username: usernameLowerCase,
        password
    };
    
    if (user == null) {
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount == 0) {
            throw 'Could not create account';
        }
    }

    return {userInserted: true};
};

const checkUser = async (username, password) => {
    if (!username) {
        throw 'Please provide username';
    }
    if (!password) {
        throw 'Please provide password';
    }
    username = username.trim();
    usernameValidation(username);
    passwordValidation(password);
    const userCollection = await users();
    const usernameCheck = await userCollection.findOne({username: username.toLowerCase()});
    if (usernameCheck === null) {
        throw 'Username is invalid';
    } else {
        const passwordCompare = await bcrypt.compare(
            password,
            usernameCheck.password
        );
        if (passwordCompare) {
            return {authenticated: true};
        } else {
            throw 'Password is invalid';
        }
    }
};
const mkfriends = async (username, fusrname) =>{
    const uCol = await users();
    const user = await uCol.findOne({ username: username.toLowerCase() });
    const fusr = await uCol.findOne({ username: fusrname.toLowerCase() });
    if(!user || !fusr){
        throw new Error('friend does not exist')
    }
    let cd = new Date();
    let cdt = cd.getDate() + "/" + (cd.getMonth() + 1) + "/" + cd.getFullYear();
    const nlistF = {_id : fusr._id, name : fusr.firstName + ' ' + fusr.lastName, addedDate : cdt, status : 'inactive', friendFeed: 'True'};
    const uid = user._id;
    
    if(ld.find(user.friendsList, {_id : fusr._id})){
        return user.friendsList;
    }else{
        let upduser = await uCol.findOneAndUpdate(
                { _id: user._id },
                { $push: { friendsList: nlistF } },
                { returnDocument: "after" }
        );
        if(upduser){
            return upduser.friendsList;
        }else{throw new Error('Unable to add friend');}
        
    }
};
const getUsrPosts = async (uid, isUsername) => {
    let uCol = await users();
    
    if(!isUsername){
        let user = await uCol.findOne({_id : new ObjectId(uid)});
        return user.userPosts;
    }else{
        let user = await uCol.findOne({username : uid.toLowerCase()});
        return user.userPosts;
    }
    
};
const getFFinfo = async (username, friendId) =>{
    const uCol = await users();
    let cusr = await uCol.findOne({username: username.toLowerCase()});
    return ld.find(cusr.friendsList, {_id : new ObjectId(friendId)})
}
const getUsrFeed = async (username) =>{
    const uCol = await users();
    let cusr = await uCol.findOne({username : username.toLowerCase()});
    console.log(cusr)
    return cusr.friendsList;
}
const rmFriend = async (fid, uname) => {
    console.log(fid)
    const uCol = await users();
    let cuser = await uCol.findOne({username: uname.toLowerCase()})
    let nusr = await uCol.findOneAndUpdate(
        { _id: cuser._id },
        { $pull: { friendsList: {_id : new ObjectId(fid)} } },
        { returnDocument: "after" }
    );
    return nusr.friendsList;
}
const addPost = async (uname, body) => {
    const uCol = await users();
    const cusr = await uCol.findOne({username : uname.toLowerCase()})
    let cd = new Date();
    let cdt = cd.getDate() + "/" + (cd.getMonth() + 1) + "/" + cd.getFullYear();
    let ndoc = {_id : new ObjectId(), body : body, comments : [], likes : 0, name: cusr.firstName + ' ' + cusr.lastName, postedDate: cdt, likedPost : [], posterID : cusr._id};
    let nusr = await uCol.findOneAndUpdate(
        { username: uname.toLowerCase() },
        { $push: { userPosts:  ndoc} },
        { returnDocument: "after" }
    )
    if(ld.find(nusr.userPosts, ndoc)){
        return ndoc;
    }else{
        throw new Error('unable to push to posts');
    }
}

const getFFeed = async (uname) =>{
    const uCol = await users();
    const cusr = await uCol.findOne({username : uname.toLowerCase()});
    const flist = cusr.friendsList;
    let rarr = cusr.userPosts;
    for (const fr of flist){
        let fusr = await uCol.findOne({_id: fr._id});
        rarr = rarr.concat(fusr.userPosts);
    };
    return rarr;
}

const likePost = async (pid, comment = '--like', uid) =>{
    const uCol = await users();
    //const cusr = await uCol.findOne({username: uid.toLowerCase()});
    const posts = await getFFeed(uid);
    let lpost = ld.find(posts, {_id : new ObjectId(pid)})
    let frnd = await uCol.findOne({_id : lpost.posterID})
    console.log(frnd)
    if(comment == '--like'){
        
        console.log('___')
        //console.log(lpost)
        if(lpost.likedPost.includes(uid)){
            console.log('INCLUDES')
            lpost.likedPost = lpost.likedPost.filter(item => item !== uid);
            lpost.likes = lpost.likes -1
        }else{
            console.log('NOT--------------INCLUDES')
            lpost.likedPost.push(uid)
            
            lpost.likes = lpost.likes + 1;
        }
        //console.log(lpost);
        
        //console.log(frnd);
        console.log(pid)
        let allp = frnd.userPosts.filter(d => d._id.toString() !== pid);
        console.log(allp);
        allp.push(lpost);
        const npost = await uCol.findOneAndUpdate(
            { _id: lpost.posterID},
            { $set: { "userPosts" :  allp} },
            { returnDocument: "after" }
        )
        return ld.find(npost.userPosts, {_id: new ObjectId(pid)})
    }else{
        let cd = new Date();
        let cdt = cd.getDate() + "/" + (cd.getMonth() + 1) + "/" + cd.getFullYear();
        const ncom = {name : frnd.firstName + ' ' + frnd.lastName, postedDate : cdt, comment: comment}
        lpost.comments.push(ncom);
        console.log('___')
        let allp = frnd.userPosts.filter(d => d._id.toString() !== pid);
        //console.log(allp);
        allp.push(lpost);
        const npost = await uCol.findOneAndUpdate(
            { _id: lpost.posterID},
            { $set: { "userPosts" :  allp} },
            { returnDocument: "after" }
        )
        let nnpost = ld.find(npost.userPosts, {_id: new ObjectId(pid)})
        console.log(nnpost)
        return ld.find(nnpost.comments, ncom)
    }
}


export {createUser, checkUser, mkfriends, getUsrPosts, getFFinfo, getUsrFeed, rmFriend, addPost, getFFeed, likePost};