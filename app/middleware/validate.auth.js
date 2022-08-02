const { check, validationResult } = require('express-validator');
const ErrorResponse = require('../../utils/errorResponse');

// Validation Rules

/**
 * User registration rules
 * Todo: stronger password validation
 */
const validateRegisterRules = () => {
	return [
		check('username')
			.exists().withMessage('MISSING_USERNAME')
			.notEmpty().withMessage('USERNAME_IS_EMPTY'),
		check('email')
			.exists().withMessage('MISSING_EMAIL')
			.notEmpty().withMessage('EMAIL_IS_EMPTY')
			.isEmail().withMessage('EMAIL_IS_NOT_VALID'),
		check('password')
			.exists().withMessage('MISSING_PASSWORD')
			.notEmpty().withMessage('PASSWORD_IS_EMPTY')
			.isLength({ min: 6 }).withMessage('PASSWORD_TOO_SHORT_MIN_6'),
	]
}

/**
 * User login request rules
 * Todo: stronger password validation
 */
const validateLoginRules = () => {
	return [
		check('email')
			.exists().withMessage('MISSING_EMAIL')
			.notEmpty().withMessage('EMAIL_IS_EMPTY')
			.isEmail().withMessage('EMAIL_IS_NOT_VALID'),
		check('password')
			.exists().withMessage('MISSING_PASSWORD')
			.notEmpty().withMessage('PASSWORD_IS_EMPTY')
			.isLength({ min: 6 }).withMessage('PASSWORD_TOO_SHORT_MIN_6'),

	]
}

// Validation function

/**
 * Validate user registration request
 * @param {Object} req - request object
 * @param {Object} res - respond object
 * @param {Object} next - next object to call next middleware
 */
const validateRegister = (req, res, next) => {
	try {
		validationResult(req).throw();

		return next();
	} catch (err) {
		const error = ErrorResponse.buildErrObject(
			'REGISTER_VALIDATION_FAILED',
			422,
			'register validation failed',
			err.array()
		);

		ErrorResponse.handleError(res, error);
	}
}

/**
 * Validate user login request
 * @param {Object} req - request object
 * @param {Object} res - respond object
 * @param {Object} next - next object to call next middleware
 */
const validateLogin = (req, res, next) => {
	try {
		validationResult(req).throw();

		return next();
	} catch (err) {
		const error = ErrorResponse.buildErrObject(
			'LOGIN_VALIDATION_FAILED',
			422,
			'login validation failed',
			err.array()
		);

		ErrorResponse.handleError(res, error);
	}
}


module.exports = {
	validateRegisterRules,
	validateRegister,
	validateLoginRules,
	validateLogin,
}

