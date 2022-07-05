const User = require('../models/User');


const signup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({
        email : req.body.email,
        password : req.body.password
    })

    newUser.save()
        .then((item) => {
            console.log(`${item} saved to database`);
        })
        .catch((err) => {
            console.log(err);
        })

    console.log(`The email is ${email}, and password is ${password}`);

    res.send("success");

    next();
}

module.exports = {
    signup,
}