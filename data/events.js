import { ObjectId } from "mongodb";
import { events, users } from "../config/mongoCollections.js";
import ld from 'lodash';
//removed the db from exports, prob gonna make an updateEvent func to update fields
const createEvent = async (
  category,
  title,
  description,
  friendsOnly,
  date,
  maxCapacity,
  userName
) => {
  if (userName == "" || userName == undefined || userName == null) {
    throw new Error("Invalid userId");
  } else {
    const eCol = await events();
    const uCol = await users();
    let cd = new Date();
    let cdt = cd.getDate() + "/" + (cd.getMonth() + 1) + "/" + cd.getFullYear();
    let nevent = {
      category: category,
      title: title,
      body: description,
      postedDate: cdt,
      eventDate: date,
      likes: [],
      comments: [],
      friendsOnly: friendsOnly,
      reviews: [],
      attendees: [],
      maxCapacity: maxCapacity,
    };
    const eins = await eCol.insertOne(nevent);
    let pid = eins.insertedId.toString();
    console.log(pid);
    const user = await uCol.findOne({ username: userName.toLowerCase() });
    let uposts = user.userEvents;
    uposts.push(pid);
    let upduser = await uCol.findOneAndUpdate(
      { _id: user._id },
      { $set: { userEvents: uposts } },
      { returnDocument: "after" }
    );
    console.log(upduser);
    if (upduser.userEvents.includes(pid)) {
      console.log("event added successfuly");
      return true;
    } else {
      return false;
    }
  }
};

const getAllEvents = async () => {
  const eCol = await events();
  const allevents = await eCol.find({}).toArray();
  return allevents;
};

const getEventById = async (eventId) => {
  const eCol = await events();
  console.log(eventId);
  const cevent = await eCol.findOne({ _id: new ObjectId(eventId) });
  if(!cevent){
    throw new Error('Could not find event');
  }
  return cevent;
};
const updateEventAppend= async (eid, keystr, val) =>{
  //keystr used to specify which part of doc u update
  //okay if this works this could be p fire
  const eCol = await events();
  const cevent = await getEventById(eid)
  if(keystr != 'comments'){
    if(keystr == 'reviews'){
      cevent.reviews.forEach(e => {
        //console.log(e.user)
        if(e.user == val.user){
          throw new Error('Duplicate reviews');
        }
      });
    }
    if(cevent[keystr].includes(val) || ld.find(cevent[keystr], val)){
      const ncevent = await eCol.findOneAndUpdate(
      { _id: new ObjectId(eid) },
      { $pull: { [keystr]: {$in : [val]} } },
      { returnDocument: "after" })
      if(!ncevent[keystr].includes(val)){
        return ncevent
      }else{throw new Error('Failed to remove from array in events')}
    }

  }
      const ncevent = await eCol.findOneAndUpdate(
        { _id: new ObjectId(eid) },
        { $push: { [keystr]: val } },
        { returnDocument: "after" }
      )
      console.log(ncevent)
      console.log(ncevent[keystr])
      console.log(val)
      if(ncevent[keystr].includes(val)){
        return ncevent;
      }else{
        if(ld.find(ncevent[keystr], val)){
          return ncevent;
        }else{throw new Error('Failed to update event')}
      }
        
  
  
  
}
export {createEvent, getAllEvents, getEventById, updateEventAppend};
