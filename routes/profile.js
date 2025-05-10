import {Router} from 'express';
const router = Router();

router.get("/events_feed", async (req, res) => {
    res.render('events/eventsPage')
});
router.get("/friends_feed", async (req, res) => {
    res.render('friends/friendsFeed')
});
router.get("/friends/list", async (req, res) => {
    res.render('friends/friendsList')
});
export default router;