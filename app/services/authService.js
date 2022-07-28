const axios = require('axios');
const crypto = require('crypto');
const ErrorResponse = require('../../utils/errorResponse');
const User = require('../models/User');

/*
 *	CRUD (Private function)
 */

/**
 * Check if user email exists in gateway
 * @param {Object} req - request object
 * @param {Object} req - response object
 */
const checkDuplicateEmail = async (req, res) => {
	try {
		const gatewayRegisterPath = '/auth/register'
		const path = `${process.env.GATEWAY_URL}${gatewayRegisterPath}`;

		const payload = {
			name: req.username,
			email: req.email.toLowerCase(),
			password: req.password,
			appId: process.env.GATEWAY_APP_ID,
			appSecret: process.env.GATEWAY_APP_SECRET,
		}
		const data = await axios.post(path, payload);

		return data;

	} catch(err) {
		const error = ErrorResponse.buildErrObject(err.response.data.statusCode, err.response.data.message);
    
        ErrorResponse.handleError(res, error);
	}
}

/**
 * Registers a new user in database
 * @param {Object} req - request object
 * @param {Object} res - respond object
 * Todo: better error handling
 */
const registerUser = async (req, res) => {
	try {
		const newUser = new User({
			_id: req.gatewayUserID,
			role: req.role.toUpperCase(),
			username: req.username,
			email: req.email.toLowerCase(),
			password: req.password,
			verification: crypto.randomUUID(),
		});
		const idExist = await User.exists({ _id: req.gatewayUserID });
		const emailExist = await User.exists({ email: req.email });

		if(idExist || emailExist){
			throw new Error("Duplicate Id or Email in local database!");
		}
		const data = await newUser.save();
		return data;

	} catch(err) {
		const error = ErrorResponse.buildErrObject(422, err.message);
    
        ErrorResponse.handleError(res, error);
	}
};

/**
 * helper function to set user as verified in development mode
 * @param {Object} req - request object
 */
 const setUserAccountStatus = async (data, res) => {
	//return the user without password
	let user = {
		_id: data._id,
		role: data.role,
		username: data.username,
		email: data.email,
		verification: data.verification,
		userAccountStatus: data.userAccountStatus,
	};

	if(process.env.NODE_ENV === 'production'){
		try{
			user = await User.findByIdAndUpdate(
				{ _id: data._id },
				{ userAccountStatus: 'VERIFIED' },
				{ new: true}
			);
			return user;
		} catch (err) {
			const error = ErrorResponse.buildErrObject(422, err.message);
    
        	ErrorResponse.handleError(res, error);
		}
	}
	return user;
};


module.exports = {
	checkDuplicateEmail,
	registerUser,
	setUserAccountStatus,
}