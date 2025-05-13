function usernameValidation(username) {
    const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
    if (typeof username != "string") {
        throw 'Username is not of type string';
    }

    if (username.trim() == "") {
        throw 'Please enter a username';
    }

    if (username.length < 4) {
        throw 'Username must have at least 4 characters.';
    }

    if (!usernameRegex.test(username)) {
        throw 'Please use valid username format';
    }
}

function passwordValidation(password) {
    const passwordRegex = /^\S{6,}$/;
    if (!passwordRegex.test(password)) {
        throw 'Password is invalid.';
    }
}

function ageCheck(date) {
    const dob = new Date(date);
    const now = new Date();
    var age = now.getFullYear() - dob.getFullYear();
    var m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m == 0 && now.getDate() < dob.getDate())) {
        age--;
    }

    if (age < 13) {
        throw 'Cannot sign up as you are too young (younger than 13).'
    }

    return age;
}

export {usernameValidation, passwordValidation, ageCheck};