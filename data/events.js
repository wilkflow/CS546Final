import { ObjectId } from 'mongodb';
import {events, users} from '../config/mongoCollections.js';

const createEvent = async (category, title, description, friendsOnly, date, maxCapacity, userName) => {
    if(userName == '' || userName== undefined || userName == null){
        throw new Error('Invalid userId')
    }else{
        const eCol = await events();
        const uCol = await users();
        let cd = new Date(); 
        let cdt = "Last Sync: " + cd.getDate() + "/" + (cd.getMonth()+1)  + "/" + cd.getFullYear();
        let nevent = {
            category: category,
            title: title,
            body: description,
            postedDate: cdt,
            eventDate: date,
            likes: [],
            comments: [],
            rsvp: [],
            friendsOnly: friendsOnly,
            reviews: [],
            attendees: [],
            maxCapacity: maxCapacity
        };
        const eins = await eCol.insertOne(nevent);
        let pid = eins.insertedId.toString();
        console.log(pid)
        const user = await uCol.findOne({username : userName.toLowerCase()})
        let uposts = user.userPosts;
        uposts.push(pid)
        let upduser = await uCol.findOneAndUpdate({_id : user._id}, { $set:{userPosts : uposts}}, {returnDocument : 'after'})
        console.log(upduser);
        if(upduser.userPosts.includes(pid)){
            console.log('event added successfuly')
            return true;
        }else{
            return false;
        }
    }
}

const getAllEvents = async () =>{
    const eCol = await events();
    const allevents = await eCol.find({}).toArray()
    return allevents;
}

const getEventById = async (eventId) =>{
    const eCol = await events();
    console.log(eventId)
    const cevent = await eCol.findOne({_id : new ObjectId(eventId)})
    return cevent;
}

export {createEvent, getAllEvents, getEventById};