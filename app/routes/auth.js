const express = require('express');
const router = express.Router();

const multer = require('multer');

// const { signupGet, signupPost } = require('../controllers/auth');

const { signup } = require('../controllers/auth');

//router.get('/signup', signupGet);
router.post('/signup', multer().none(), signup);

// router.get('/login', (req, res, next) => {
//     console.log('This is a login route');
//     res.send("Success login route response");
// });

module.exports = router;