import { Router } from "express";
import {
  createUser, checkUser, mkfriends
} from "../data/users.js";
import { ObjectId } from "mongodb";
const router = Router();

router.post("/friends/add", async (req, res) => {
    let uname = req.session.user;
    let fname = req.body.username;
    console.log(fname);
    const nlist = await mkfriends(uname, fname);
    if(nlist){
        console.log(nlist)
        res.status(200).json(nlist);
    }else{
        res.status(400)
    }
})

export default router;

