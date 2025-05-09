import {users} from '../config/mongoCollections.js';
import bcrypt from 'bcrypt';
const saltRounds = 16;
import { usernameValidation, passwordValidation } from '../public/js/validation.js';

const createUser = async (username, password) => {
    if (!username) {
        throw 'Please provide username';
    }
    if (!password) {
        throw 'Please provide password';
    }
    usernameValidation(username);
    passwordValidation(password);
    let usernameLowerCase = username.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({username: usernameLowerCase});
    if (user != null) {
        throw 'User already exists.';
    }
    password = await bcrypt.hash(password, saltRounds);
    let newUser = {
        username: usernameLowerCase,
        password
    };
    
    if (user == null) {
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount == 0) {
            throw 'Could not create account';
        }
    }

    return {userInserted: true};
};

const checkUser = async (username, password) => {
    if (!username) {
        throw 'Please provide username';
    }
    if (!password) {
        throw 'Please provide password';
    }
    username = username.trim();
    usernameValidation(username);
    passwordValidation(password);
    const userCollection = await users();
    const usernameCheck = await userCollection.findOne({username: username.toLowerCase()});
    if (usernameCheck === null) {
        throw 'Username is invalid';
    } else {
        const passwordCompare = await bcrypt.compare(
            password,
            usernameCheck.password
        );
        if (passwordCompare) {
            return {authenticated: true};
        } else {
            throw 'Password is invalid';
        }
    }
};

export {createUser, checkUser};