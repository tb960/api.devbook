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
 */
const checkDuplicateEmail = async (req) => {
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
		throw new ErrorResponse.ErrorHandler(
			'DUPLICATE_EMAIL_GATEWAY',
			422,
			'Gateway detected duplicated email!',
			err.response.data.message,
		);
	}
}

/**
 * Registers a new user in database
 * @param {Object} req - request object
 * Todo: better error handling
 */
const registerUser = async (reqData) => {
	try {
		const newUser = new User({
			_id: reqData.gatewayUserID,
			role: reqData.role.toUpperCase(),
			username: reqData.username,
			email: reqData.email.toLowerCase(),
			password: reqData.password,
			verification: crypto.randomUUID(),
		});
		const idExist = await User.exists({ _id: reqData.gatewayUserID });
		const emailExist = await User.exists({ email: reqData.email });

		if(idExist || emailExist){
			throw new Error('Id or Email does not exist in gateway database.');
		}
		const data = await newUser.save();
		return data;

	} catch(err) {
		throw new ErrorResponse.ErrorHandler(
			'REGISTER_FAILED',
			422,
			'Unable to register user to Magor database!',
			err.message
		);
	}
};

/**
 * helper function to set user as verified in development mode
 * @param {Object} data - user data
 */
const setUserAccountStatus = async (data) => {
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
			//pass new = true to get updated user in return variable
			user = await User.findByIdAndUpdate(
				{ _id: data._id },
				{ userAccountStatus: 'VERIFIED' },
				{ new: true }
			);
			if(!user){
				throw new Error('Fail to find by id and update.');
			}
			return user;
		} catch (err) {
			throw new ErrorResponse.ErrorHandler(
				'USER_REGISTRATION_VERIFICATION_FAILED',
				422,
				'This error should only come in development mode, unable to auto verified user account status to verified mode without using email verification',
				err.message
			);
		}
	}
	return user;
}

/**
 * Finds user by email
 * @param {string} email - user´s email
 */
const findUserByEmail = async (email) => {
	try {
		const user = await User.findOne({ email: email });
		if(!user){
			throw new Error('No user with this email exist');
		}
		return user;
	} catch(err) {
		throw new ErrorResponse.ErrorHandler(
			'USER_DOES_NOT_EXIST',
			422,
			'Magor database contained no such email! Consider register yourself.',
			err.message
		);
	}
}

/**
 * Checks if user false login attempts is more than 5 times
 * @param {Object} user - user object
 */
const checkLoginAttemptAndBlockUser = async (user) => {
	const blockHours = 2;
	const addTwoHours = new Date(Date.now() + blockHours * (60 * 60 * 1000));
	const resetLoginAttempts = 0;
	let currUser = user;

	if(user.loginAttempts >= 5){
		try {
			currUser = await User.findOneAndUpdate(
				{ email: user.email },
				{ loginAttempts: resetLoginAttempts, blockExpireDate: addTwoHours },
				{ new: true }
			);
			if(!currUser){
				throw new Error('No user with this email exixts! Unable to block user.');
			}
			return currUser;
		} catch (err) {
			throw new ErrorResponse.ErrorHandler(
				'USER_BLOCK_FAILED',
				422,
				'Cannot perform a blocking operation.',
				err.message
			);
		}
	}
	return currUser;
}

/**
 * Checks if blockExpireDate from user is greater than now
 * @param {Object} user - user object
 */
const isUserBlocked = async (user) => {
	const now = new Date(Date.now());
	try {
		if(user.blockExpireDate > now){
			throw new Error('This user is blocked! Please try again later!')
		}
		return false;
	} catch (err) {
		throw new ErrorResponse.ErrorHandler(
			'BLOCKED_USER',
			409,
			'Function to check if current user is blocked',
			err.message
		);
	}
}

/**
 * update login attempts before logging in
 * @param {Object} user - user object
 */
const updateLoginAttempts = async (user, option) => {
	let attempts = user.loginAttempts;
	switch(option.toUpperCase()){
	case 'INCREASE':
		attempts = user.loginAttempts + 1;
		break;
	case 'RESET':
		attempts = 0;
		break;
	default:
		break;
	}
	try {
		const updatedUser = await User.findOneAndUpdate(
			{ email: user.email },
			{ loginAttempts: attempts},
			{ new: true }
		);
		if(!updatedUser){
			throw new Error('No user with this email exist');
		}
		return updatedUser;
	} catch (err) {
		throw new ErrorResponse.ErrorHandler(
			'UPDATE_USER_LOGIN_ATTEMPTS',
			409,
			'Function to update login attempts',
			err.message
		);
	}
}

/**
 * login User using gateway service
 * @param {Object} user - user object
 */
const gatewayLoginUser = async (user, updatedUser) => {
	try {
		const gatewayLoginPath = '/auth/login'
		const path = `${process.env.GATEWAY_URL}${gatewayLoginPath}`;

		const payload = {
			email: user.email.toLowerCase(),
			password: user.password,
			appId: process.env.GATEWAY_APP_ID,
			appSecret: process.env.GATEWAY_APP_SECRET,
		}
		const resData = await axios.post(path, payload);
		//if resData then reset loginAttempts to 0
		if(resData){
			await updateLoginAttempts(updatedUser, 'reset');
		}
		return resData.data.accessToken;
	} catch (err) {
		//can i update database if catch any error
		switch(err.response.status){
		case 401:
			throw new ErrorResponse.ErrorHandler(
				'GATEWAY_LOGIN_FAILED',
				err.response.status,
				'Login Fail: Incorrect Password',
				err.message
			);
		case 404:
			throw new ErrorResponse.ErrorHandler(
				'GATEWAY_LOGIN_FAILED',
				err.response.status,
				'Login Fail: User not found.',
				err.message
			);
		default:
			throw new ErrorResponse.ErrorHandler(
				'GATEWAY_LOGIN_FAILED',
				err.response.status,
				'Error while logging user in through gateway',
				err.message
			);
		}
	}
}



module.exports = {
	checkDuplicateEmail,
	registerUser,
	setUserAccountStatus,
	findUserByEmail,
	checkLoginAttemptAndBlockUser,
	isUserBlocked,
	updateLoginAttempts,
	gatewayLoginUser,
}
