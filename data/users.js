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


export {createUser, checkUser, mkfriends, getUsrPosts, getFFinfo, getUsrFeed};