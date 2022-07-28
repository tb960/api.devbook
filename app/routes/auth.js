// import npm packages
const express = require('express');
const router = express.Router();
const trimRequest = require('trim-request');


// import validators
const validators = require('../middleware/validate.auth');


// import controllers
const { register } = require('../controllers/auth');


// import middlewares/ utils
// import others


router.post('/register', trimRequest.all, validators.validateRegisterRules(), validators.validateRegister, register);

module.exports = router;