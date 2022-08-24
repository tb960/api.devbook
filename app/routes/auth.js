// import npm packages
const express = require('express');
const router = express.Router();
// import validators
const validators = require('../middleware/validate.auth');
// import controllers
const authController = require('../controllers/authController');
// import middlewares/ utils
const multer = require('../middleware/multer');
const passport = require('../middleware/passport');
const trimRequest = require('trim-request');
// import others

// Public Route
/*
 * POST /register
 */
router.post('/register', multer.uploadNone, trimRequest.all, validators.validateRegisterRules(), validators.validateRegister, authController.register);
/*
 * POST /login
 */
router.post('/login', multer.uploadNone, trimRequest.all, validators.validateLoginRules(), validators.validateLogin, authController.login);
/*
 * Forgot password route
 */
router.post('/forgot', multer.uploadNone, trimRequest.all, validators.validateForgotPasswordRules(), validators.validateForgotPassword, authController.forgotPassword);
/*
 * GET user data
 */
router.get('/', trimRequest.all, authController.getUser);
/*
 * GET /verify
 */
router.get('/verify/:id', trimRequest.all, validators.validateVerificationRules(), validators.validateVerification, authController.verifyUser);

//Protected Route
/*
 * Get new refresh token (Undone, need to check with gateway to get new refresh token)
 */
router.get('/token', trimRequest.all, passport.applyJwtAuth, authController.getRefreshToken);

//todo:
//post verify in case user forgot to verify before login



module.exports = router;
