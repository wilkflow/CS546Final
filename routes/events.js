import {Router} from 'express';
import {createEvent, getAllEvents, getEventById} from '../data/events.js';
const router = Router();
router.get("/events", async (req, res) => {
    if (req.session.user) {
        let events = await getAllEvents()
        //console.log(events)
        res.status(200).json(events);
    }else{
        //TODO reroute
    }
       
});
router.get("/events/addevent", async (req, res) => {
    if (req.session.user) {
        res.render('events/eventForm');
    }else{
        //TODO reroute
    }
       
});
router.post('/events', async (req, res) =>{
    if (req.session.user) {
        let data = req.body;
        let insres = await createEvent(data.category, data.title, data.description, false, data.date, data.maxCapacity, req.session.user)
        console.log(insres);
        if (insres == true){
            res.status(200).redirect('/events_feed');
        }else{
            res.status(400);
        }
    }else{
        //TODO reroute
    }
})
router.get('/events/:id', async (req, res) =>{
    let eid = req.params.id;
    const edat = await getEventById(eid);
    res.status(200).render('events/eventDetails', {edata: edat});
})

export default router;