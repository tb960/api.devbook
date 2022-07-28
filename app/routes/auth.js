// import npm packages
const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');


// import validators
const validators = require('../middleware/validate.auth');


// import controllers
const authController = require('../controllers/authController');


// import middlewares/ utils
// import others


router.post('/register', trimRequest.all, validators.validateRegisterRules(), validators.validateRegister, authController.register);

module.exports = router;