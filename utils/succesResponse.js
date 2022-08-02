// /**
//  * Builds error object
//  * @param {number} code - error code
//  * @param {string} message - error text
//  */
// const buildSuccessObject = (code, message) => {
// 	return {
// 		code,
// 		message,
// 	};
// };

// /**
//  * Sends response by using statusCode and payload as parameters
//  * @param  {Object} res - http response object
//  * @param  {Number} statusCode - status code to be returned
//  * @param  {Object} payload - payload to be returned
//  */
// const handleSuccess = (res, code, message, isError = true) => {
// 	if (process.env.NODE_ENV === 'development' && isError) {
// 		console.log(code);
// 		console.log(message);
// 	}

// 	message = typeof message === String ? message : JSON.stringify(message);

// 	const payload = {
// 		code,
// 		message,
// 	};
// 	res.status(code).send(payload);
// };


// module.exports = {
// 	buildResponseObject,
// 	handleResponse,
// }
