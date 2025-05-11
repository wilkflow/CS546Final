import { Router } from "express";
import {
  events,
  createEvent,
  getAllEvents,
  getEventById,
} from "../data/events.js";
import { ObjectId } from "mongodb";
const router = Router();
router.get("/events", async (req, res) => {
  if (req.session.user) {
    let events = await getAllEvents();
    //console.log(events)
    res.status(200).json(events);
  } else {
    //TODO reroute
  }
});
router.get("/events/addevent", async (req, res) => {
  if (req.session.user) {
    res.render("events/eventForm");
  } else {
    //TODO reroute
  }
});
router.post("/events", async (req, res) => {
  if (req.session.user) {
    let data = req.body;
    let insres = await createEvent(
      data.category,
      data.title,
      data.description,
      data.friendsOnly,
      data.date,
      data.maxCapacity,
      req.session.user
    );
    console.log(insres);
    if (insres == true) {
      res.status(200).redirect("/events_feed");
    } else {
      res.status(400);
    }
  } else {
    //TODO reroute
  }
});
router.get("/events/:id", async (req, res) => {
  let eid = req.params.id;
  const edat = await getEventById(eid);
  res.status(200).render("events/eventDetails", { edata: edat });
});

// ----- start changes -----
// Ok so i added one more route that just has /data after the id
// This will do res.json for ONLY the data that is already public on the UI (and any private info stays private)
// That way, this .json version of the event can be viewed through fetch and/or accessing a .json version on the browser
// ^ and iirc this is something that prof showed in lecture when explaining json format where some websites allow users to see the data by adding .json in the url and stuff

// This allows dynamic updates on the frontend using the fetch functions without forcing the user to refresh the page after every button press
// If you DON'T want to use this, then just delete it AND let me know in the whatsapp!
//          you can also uncomment the "// window.location.reload();" lines in eventDetails.js if so

// If you do choose to keep it then just delete this block of comments
// ~ Brian (events frontend)
router.get("/events/:id/data", async (req, res) => {
  let eid = req.params.id; //Same exact code as :id, except it selects specific data to send through the res.json
  const edat = await getEventById(eid);
  res.status(200).json({
    title: edat.title,
    description: edat.body,
    date: edat.eventDate,
    category: edat.category,
    attendees_count: edat.attendees.length,
    maxCapacity: edat.maxCapacity,
    likes_count: edat.likes.length,
    friendsOnly: edat.friendsOnly,
  });
});

//TODO: Look over this code: router.post for events/:id/rsvp (RSVP button)
//  This is just some test code that I made just to test if the values update on the UI, but I think it works fine as is?
//  also exported events from data/events.js, and imported events into here in order to use collection.updateOne
//  you can use this as starter code, or you can just scrap it and start from fresh
router.post("/events/:id/rsvp", async (req, res) => {
  const eid = req.params.id;
  const edat = await getEventById(eid);
  if (!edat) {
    return res.status(404).json({ error: "Event not found" });
  }

  const eCol = await events();
  const userValue = "1";

  let updatedAttendees;
  if (edat.attendees.includes(userValue)) {
    updatedAttendees = edat.attendees.filter((a) => a !== userValue);
  } else {
    updatedAttendees = [...edat.attendees, userValue];
  }

  const updateResult = await eCol.updateOne(
    { _id: new ObjectId(eid) },
    { $set: { attendees: updatedAttendees } }
  );

  //todo: Check the res.status values and change the 200 and 500 if needed
  if (updateResult.modifiedCount === 1) {
    return res.status(200).json({ attendees: updatedAttendees });
  } else {
    return res.status(500).json({ error: "Failed to update attendees" });
  }
});

router.post("/events/:id/rsvp", async (req, res) => {
  //TODO: router.post for events/:id/like (Like button)
  //    Button behaves as a toggle just like RSVP, so you can use similar logic to the RSVP code above
});

router.get("/events/:id/comments", async (req, res) => {
  //TODO: router.get for events/:id/comments
  //    This is called when trying to access the list of comments for the event
  //    It expects a res.json that contains the array of comments
  const eid = req.params.id;
  const edat = await getEventById(eid);
  console.log(edat);
  //todo: fill in anything that needs to be checked, etc.
  return res.status(200).json(edat.comments || []);
});

router.get("/events/:id/reviews", async (req, res) => {
  //TODO: router.get for events/:id/reviews
  //    This is called when trying to access the list of reviews for the event
  //    It expects a res.json that contains the array of reviews
  const eid = req.params.id;
  const edat = await getEventById(eid);

  //todo: fill in anything that needs to be checked, etc.
  return res.status(200).json(edat.reviews || []);
});

router.post("/events/:id/comments", async (req, res) => {
  //TODO: router.post for events/:id/comments
  //    This is called when trying to submit a comment
  //    you can use this as starter code, or you can scrap it and start from fresh
  const eid = req.params.id;
  const edat = await getEventById(eid);
  if (!edat) {
    return res.status(404).json({ error: "Event not found" });
  }

  const eCol = await events();
  const newComment = {
    user: req.session.user,
    text: req.body.text?.trim(),
  };
  const updatedComments = [...edat.comments, newComment];
  const updateResult = await eCol.updateOne(
    { _id: new ObjectId(eid) },
    { $set: { comments: updatedComments } }
  );
  //todo: Check the res.status values and change the 200 and 500 if needed
  if (updateResult.modifiedCount === 1) {
    return res.status(200).json({ attendees: updatedAttendees });
  } else {
    return res.status(500).json({ error: "Failed to update attendees" });
  }
});
router.post("/events/:id/reviews", async (req, res) => {
  //TODO: router.post for events/:id/reviews
  //    This is called when trying to submit a review
  //    This should functionally be identical to comments except it just takes in an additional rating parameter
  const newReview = {
    user: req.session.user,
    text: req.body.text?.trim(),
    rating: parseInt(req.body.rating, 10),
  };
});
//TODO: GET route for /events?search=
// --- end changes ---

export default router;
