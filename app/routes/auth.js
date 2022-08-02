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

/*
 * POST /register
 */
router.post('/register', trimRequest.all, validators.validateRegisterRules(), validators.validateRegister, authController.register);
/*
 * POST /login
 */
router.post('/login', trimRequest.all, validators.validateLoginRules(), validators.validateLogin, authController.login);

module.exports = router;
