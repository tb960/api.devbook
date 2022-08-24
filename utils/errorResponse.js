/**
 * Error handler class
 * author: Boon Khang
 * @param {string} errorName - error name
 * @param {number} httpStatusCode - error code
 * @param {string} message - error message
 * @param {string} description - error description
 */
class ErrorHandler extends Error {
	constructor(errorName, httpStatusCode, description, message){
		super(message);
		this.errorName = errorName;
		this.httpStatusCode = httpStatusCode;
		this.description = description;
	}
}

/**
 * Builds error object for middleware function
 * author: Boon Khang
 * @param {number} code - error code
 * @param {string} message - error text
 */
const buildErrObject = (errorName, httpStatusCode, description, message) => {
	return {
		errorName,
		httpStatusCode,
		description,
		message,
	};
};


/**
 * Handles error by printing to console in development env and builds and sends an error response
 * author: Boon Khang
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
const handleError = (res, err) => {
	// Prints error in console
	if (process.env.NODE_ENV === 'development') {
		// console.log(err.name);
		// console.log(err.httpStatusCode);
		// console.log(err.description);
		// console.log('The next line is error message:');
		// console.log(err.message);
		console.log(err);
	}
	// Sends error to user
	res.status(err.httpStatusCode).json({
		Error: err.httpStatusCode,
		ErrorName: err.errorName,
		Message: err.message,
		Description: err.description,
	});
};

// example of the error response
// {
//     "statusCode": 400,
//     "message": [
//         "name should not be empty",
//         "name must be longer than or equal to 3 characters",
//         "name must be a string",
//         "email must be longer than or equal to 6 characters",
//         "email must be an email",
//         "password must be longer than or equal to 6 characters",
//         "password should not be empty",
//         "password must be a string"
//     ],
//     "error": "Bad Request"
// }


module.exports = {
	ErrorHandler,
	buildErrObject,
	handleError,
}
