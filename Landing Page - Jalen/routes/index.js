import users from './users.js';

const constructorMethod = (app) => {
    app.use("/", users);

    app.use(/(.*)/, (req, res) => {
        res.sendStatus(404);
    });
};

export default constructorMethod;