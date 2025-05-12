import { Router } from "express";
import {
  createUser, checkUser, mkfriends, getUsrPosts,
  getFFinfo, getUsrFeed, rmFriend, addPost, getFFeed, likePost
} from "../data/users.js";
import { ObjectId } from "mongodb";
const router = Router();


router.post("/friends/add", async (req, res) => {
    let uname = req.session.user;
    let fname = req.body.username;
    console.log(fname);
    const nlist = await mkfriends(uname, fname);
    if(nlist){
        //console.log(nlist)
        res.status(200).json(nlist);
    }else{
        res.status(400)
    }
});


router.get("/friends_list", async (req, res) => {
    console.log('______________________TEGBLINJBHLGVF______________________-')
    let uname = req.session.user;
    const flist = await getUsrFeed(uname) ;
    console.log(flist)
    res.render('friends/friendsList', {friends : flist});
});

router.post("/friends/remove", async (req, res) => {
    let uname = req.session.user;
    let data = req.body.friendId
    const flist = await rmFriend(data, uname) ;
    console.log(flist)
    res.status(200).render('friends/friendsList', {friends : flist});
});

router.post("/friends/post", async (req, res) =>{
    let uname = req.session.user;
    let data =  req.body.body;
    const nPost = await addPost(uname, data);
    res.status(200).json(nPost);
});

router.get("/friends/feed", async (req, res) =>{
    console.log('frind feed')
    let uname = req.session.user;
    const posts = await getFFeed(uname);
    res.render('friends/friendsFeed', {posts:posts})
});

router.post("/friends/like", async (req, res) =>{
    console.log('liekeedddd')
    let data =  req.body
    let uname = req.session.user;   
    const npost = await likePost(data.postId, '--like', uname)
    res.status(200).json(npost);
});
router.post("/friends/comment", async (req, res) =>{
    console.log('liekeedddd')
    let data =  req.body
    let uname = req.session.user;   
    const npost = await likePost(data.postId, data.comment, uname)
    res.status(200).json(npost);
});

router.get("/friends/:id", async (req, res) => {
    //console.log('fdghyj')
    const uid = req.params.id;
    const friendListDat = await getFFinfo(req.session.user, uid);
    const friendPosts = await getUsrPosts(uid, false)
    res.render('friends/friend', {posts : friendPosts, friend : friendListDat})
});
export default router;

