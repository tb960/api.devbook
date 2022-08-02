// import packages
const { matchedData } = require('express-validator');

// import models

//import services
const authSvc = require('../services/authService');
const emailSvc = require('../services/emailService');

// import other
const ErrorResponse = require('../../utils/errorResponse');


/**
 * Register function called by route
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
		//Todo: build saveUserAccessInfoAndReturnSuccessPayload
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

module.exports = {
	register,
	login,
}
