import users from './users.js';
import prof from './profile.js'
import events from './events.js';
const constructorMethod = (app) => {
    app.use("/", users);
    app.use(prof);
    app.use(events);
    app.use(/(.*)/, (req, res) => {
        res.sendStatus(404);
    });
};

export default constructorMethod;