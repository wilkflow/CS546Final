import users from './users.js';
import prof from './profile.js'

const constructorMethod = (app) => {
    app.use("/", users);
    app.use(prof);
    app.use(/(.*)/, (req, res) => {
        res.sendStatus(404);
    });
};

export default constructorMethod;