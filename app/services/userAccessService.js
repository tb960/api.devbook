const requestIp = require('request-ip');
const requestCountry = require('request-country');
const crypto = require('crypto');
const UserAccess = require('../models/UserAccess');
const ForgotPassword = require('../models/ForgotPassword');
const ErrorResponse = require('../../utils/errorResponse');

/*
 *	CRUD (Private function)
 */

/**
 * Gets IP from user
 * @param {*} req - request object
 */
const getIP = (req) => {
	return requestIp.getClientIp(req);
}

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
const getBrowserInfo = (req)  => {
	if(req.headers['user-agent']){
		return req.headers['user-agent'];
	}
	return 'XX';
}

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
const getCountry = (req) => {
	const country = requestCountry(req);
	if(country) {
		return country;
	}
	return 'XX';
}

/**
 * Update user access table in database
 * author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} user - user data
 */
const saveUserAccessInfo = async (req, user) => {
	try {
		const userAccess = new UserAccess({
		    email: user.email,
		    ip: getIP(req),
		    browser: getBrowserInfo(req),
		    country: getCountry(req),
		});
		const data = userAccess.save();
		return data;
	} catch (err) {
		throw new ErrorResponse.ErrorHandler(
			'USER_ACCESS_TABLE_FAILED',
			422,
			'Cannot update user access table',
			err.message,
		);
	}
}

/**
 * Creates a new password forgot
 * @param {Object} req - request object
 */
const saveForgotPasswordAttempt = async (req) => {
	try {
		const forgotPassword = new ForgotPassword({
			email: req.body.email,
			//generate a new verification id for forgot password
			verification: crypto.randomUUID(),
			ipRequest: getIP(req),
			browserRequest: getBrowserInfo(req),
			countryRequest: getCountry(req),
		})
		const data = forgotPassword.save();
		return data;
	} catch (err) {
		throw new ErrorResponse.ErrorHandler(
			'FORGOT_PASSWORD_TABLE_FAILED',
			422,
			'Cannot update forgot password table',
			err.message,
		);
	}
}

module.exports = {
	saveUserAccessInfo,
	saveForgotPasswordAttempt,
}
