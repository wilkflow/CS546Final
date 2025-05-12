import { Router } from "express";
import {
  createUser, checkUser, mkfriends, getUsrPosts,
  getFFinfo, getUsrFeed
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
router.get("/friends/:id", async (req, res) => {
    //console.log('fdghyj')
    const uid = req.params.id;
    const friendListDat = await getFFinfo(req.session.user, uid);
    const friendPosts = await getUsrPosts(uid, false)
    res.render('friends/friend', {posts : friendPosts, friend : friendListDat})
});

router.get("/friends_list", async (req, res) => {
    console.log('______________________TEGBLINJBHLGVF______________________-')
    let uname = req.session.user;
    const flist = await getUsrFeed(uname) ;
    console.log(flist)
    res.render('friends/friendsList', {friends : flist});
});



export default router;

