import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import session from 'express-session';

app.use("/public", express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(
    session({
        name: "AuthCookie",
        secret: "This is a secret",
        saveUninitialized: true,
        resave: false
    })
);

app.use(async (req, res, next) => {
    const timeStamp = new Date().toUTCString();
    if (req.session.user) {
        console.log("[" + timeStamp + "]: " + req.method + " " + req.originalUrl + " " + "(Authenticated User)");
    } else {
        console.log("[" + timeStamp + "]: " + req.method + " " + req.originalUrl + " " + "(Non Authenticated User)");
    }
    next();
});

app.use("/profile", (req, res, next) => {
    if (!req.session.user) {
        return res.status(403).render("landing/fallback", {
            error: "User Not Logged In",
            title: "Error"
        });
    } else {
        next();
    }
});

configRoutes(app);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});