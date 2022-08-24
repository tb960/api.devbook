// import packages
const { matchedData } = require('express-validator');

// import models

//import services
const authSvc = require('../services/authService');
const emailSvc = require('../services/emailService');
const userAccessSvc =  require('../services/userAccessService');

// import other
const ErrorResponse = require('../../utils/errorResponse');


/**
 * Register function called by route
 * author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const register = async (req, res) => {
	try {
		// Gets locale from header 'Accept-Language'
		const locale = req.getLocale();
		const reqData = matchedData(req);
		const gatewayRegisteredData = await authSvc.checkDuplicateEmail(reqData);
		if(gatewayRegisteredData){
			reqData.gatewayUserID = gatewayRegisteredData.data.user._id;
			reqData.role = gatewayRegisteredData.data.user.role;
			// register user to local database
			const data = await authSvc.registerUser(reqData);
			if(data){
				// add verification code to user object when in developer mode
				const userInfo = await authSvc.setUserAccountStatus(data);
				//Todo: add send register email
				emailSvc.sendRegistrationEmail(locale, userInfo);
				//Todo: build success response object
				const successPayload = {
					token: 'unavailable',
					user: userInfo
				};
				//Todo: build handleResponse
				res.status(201).json({
					statusCode: 201,
					...successPayload,
				}); //Todo: better success object reponse in utils
			}
		}
	} catch(err) {
		ErrorResponse.handleError(res, err);
	}
}

/**
 * Login function by using gateway service called by route
 * author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const login = async (req, res) => {
	try {
		const data = matchedData(req);
		let user = await authSvc.findUserByEmail(data.email);
		//check loginAttempts, check isUserBlock
		user = await authSvc.checkLoginAttemptAndBlockUser(user);
		await authSvc.isUserBlocked(user);
		//if reach here, means the user is not blocked
		const updatedUser = await authSvc.updateLoginAttempts(user, 'increase');
		const loginToken = await authSvc.gatewayLoginUser(data, updatedUser);
		//Todo: build success response object
		const userAccessInfo = await userAccessSvc.saveUserAccessInfo(req, updatedUser);
		//Todo: check if user verified or not, if not, ask if user want to resend verification email again
		//then redirect user back to login page
		const successPayload = {
			accessToken: loginToken,
			user: {
				username: updatedUser.username,
				email: updatedUser.email,
				role: updatedUser.role
			}
		};
		//Todo: build handleResponse
		res.status(201).json({
			statusCode: 201,
			...successPayload,
		}); //Todo: better success object reponse in util
	} catch(err) {
		ErrorResponse.handleError(res, err);
	}
}

/**
 * Get Current User
 * author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getUser = async (req, res) => {
	try {
		const accessToken = authSvc.getAccessToken(req.headers.authorization);
		const userId = await authSvc.getUserIdFromToken(accessToken);
		const user = await authSvc.findUserById(userId);
		//Todo: build success response object
		const successPayload = {
			user: {
				username: user.username,
				email: user.email,
				role: user.role
			}
		};
		//Todo: build handleResponse
		res.status(200).json({
			statusCode: 200,
			...successPayload,
		}); //Todo: better success object reponse in util
	} catch (err) {
		ErrorResponse.handleError(res, err);
	}
}

/**
 * Refresh token function called by route
 * Author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const getRefreshToken = async (req, res) => {
	try {
		const prevAccessToken = authSvc.getAccessToken(req.headers.authorization);
		const userId = await authSvc.getUserIdFromToken(prevAccessToken);
		const user = await authSvc.findUserById(userId);
		//update user access attempt in user access table and return token
		//const token = await saveUserAccessAndReturnToken(req, user, tokenEncrypted);
		//delete token.user;
		res.status(200).json(prevAccessToken);
	} catch (err) {
		ErrorResponse.handleError(res, err);
	}
}

/**
 * Verify user function called by route
 * Author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const verifyUser = async (req, res) => {
	try {
		const data = matchedData(req);
		const user = await authSvc.verificationExists(data.id);
		const updatedUser = await authSvc.verifyUser(user);
		//Todo: build success response object
		const successPayload = {
			user: {
				username: updatedUser.username,
				email: updatedUser.email,
				role: updatedUser.role,
				userStatus: updatedUser.userAccountStatus,
			}
		};
		//Todo: build handleResponse
		res.status(200).json({
			statusCode: 200,
			...successPayload,
		}); //Todo: better success object reponse in util
	} catch (err) {
		ErrorResponse.handleError(res, err);
	}
}

/**
 * Forgot password function called by route
 * Author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const forgotPassword = async (req, res) => {
	try {
		const locale = req.getLocale();
		const data = matchedData(req);
		const user = await authSvc.findUserByEmail(data.email);
		const forgotPasswordInfo = await userAccessSvc.saveForgotPasswordAttempt(req);
		console.log(forgotPasswordInfo);
		emailSvc.sendForgotPasswordEmail(locale, user, forgotPasswordInfo);
		res.send('Forgot password route');
	} catch (err) {
		ErrorResponse.handleError(res, err);
	}
}

module.exports = {
	register,
	login,
	getUser,
	getRefreshToken,
	verifyUser,
	forgotPassword,
}
