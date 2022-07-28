/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
 const buildErrObject = (code, message) => {
	return {
		code,
		message,
	};
};

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
 const handleError = (res, err) => {
	// Prints error in console
	if (process.env.NODE_ENV === 'development') {
		console.log(err);
	}
	// Sends error to user
	res.status(err.code).json({
		statusCode: err.code,
		message: err.message,
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
	buildErrObject,
	handleError,
}