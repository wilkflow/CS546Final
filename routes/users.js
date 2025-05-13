import {Router} from 'express';
const router = Router();
import {createUser, checkUser, updateUser} from '../data/users.js';
import { usernameValidation, passwordValidation, ageCheck } from '../public/js/validation.js';

router.get("/", async (req, res) => {
    if (req.session.user) {
        res.redirect("/profile");
    } else {
        res.render("landing/homepage", {title: "Homepage"});
    }
});

router.get("/login", async (req, res) => {
    if (req.session.user) {
        res.redirect("/profile");
    } else {
        res.render("landing/login", {title: "Login"});
    }
})

router.get("/signup", async (req, res) => {
    if (req.session.user) {
        res.redirect("/profile");
    } else {
        res.render("landing/signup", {title: "Sign Up"});
    }
});

router.post("/login", async (req, res) => {
    try {
        let data = req.body;
        if (!data || data.username == "") throw 'Please provide username';
        usernameValidation(data.username);
        if (!data || data.password == "") throw 'Please provide password';
        passwordValidation(data.password);
        const {username, password} = data;

        try {
            let users = await checkUser(username, password);
            if (users.authenticated == true) {
                req.session.user = username;
                res.redirect("/profile");
            }
        } catch (e) {
            res.status(400).render("landing/login", {
                error: e,
                username: username,
                password: password,
                title: "Login"
            });
        }
    } catch (e) {
        res.status(400).render("landing/login", {
            error: e,
            username: req.body.username,
            password: req.body.password,
            title: "Login"
        });
    }
});

router.post("/signup", async (req, res) => {
    try {
        let data = req.body;
        if (!data || data.username == "") throw 'Please provide username';
        usernameValidation(data.username);
        if (!data || data.password == "") throw 'Please provide password';
        passwordValidation(data.password);
        ageCheck(data.dob);
        const {username, password, dob} = data;

        try {
            let users = await createUser(username, password, dob);
            if (users.userInserted == true) {
                res.redirect("/login");
            } else {
                res.status(500).json({error: "Internal Server Error"});
            }
        } catch (e) {
            res.status(400).render("landing/signup", {
                error: e,
                username: username,
                password: password,
                title: "Sign Up"
            });
        }
    } catch (e) {
        res.status(400).render("landing/signup", {
            error: e,
            username: req.body.username,
            password: req.body.password,
            title: "Sign Up"
        });
    }
});

router.get("/profile", async (req, res) => {
    try {
        if (req.session.user) {
            res.render("landing/profile", {
                username: req.session.user,
                title: "Profile"
            });
        }
    } catch (e) {
        res.status(400).render("landing/error", {
            error: e,
        });
    }
});

router.get("/profile/settings", async (req, res) => {
    try {
        if (req.session.user) {
            res.render("landing/settings", {
                username: req.session.user,
                title: "Settings"
            });
        }
    } catch (e) {
        res.status(400).render("landing/error", {
            error: e,
        });
    }
});

router.post("/profile/settings", async (req, res) => {
    try {
        let data = req.body;
        let username = req.session.user;
        let {firstName, lastName} = data;

        try {
            let users = await updateUser(username, firstName, lastName);
            if (users.infoUpdated == true) {
                res.redirect("/profile");
            } else {
                res.status(400).render("landing/settings", {
                    error: e,
                    username: username,
                    firstName: firstName,
                    lastName: lastName,
                    title: "Settings"
                });
            }
        } catch(e) {
            res.status(400).render("landing/settings", {
                error: e,
                title: "Settings"
            });
        }
    } catch(e) {
        res.status(400).render("landing/settings", {
            error: e,
            title: "Settings"
        });
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy();
    res.clearCookie("AuthCookie");
    res.render("landing/logout", {title: "Lougout"});
});

export default router;