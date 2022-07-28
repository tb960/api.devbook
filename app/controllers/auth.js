// import packages
const { matchedData } = require('express-validator');

// import models

//import services
const { checkDuplicateEmail, registerUser } = require('../services/auth');

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
        // const locale = req.getLocale();
        req = matchedData(req);
        const gatewayRegisteredData = await checkDuplicateEmail(req, res);
        if(gatewayRegisteredData){
            req.gatewayUserID = gatewayRegisteredData.data.user._id;
            req.role = gatewayRegisteredData.data.user.role;
            // register user to local database
			const userInfo = await registerUser(req, res);

            if(userInfo){
                //build success response object
                const successPayload = { 
                    token: 'unavailable', 
                    user: userInfo 
                };
                //build handleResponse
			    res.status(201).json({
                    statusCode: 201,
                    ...successPayload,
                }); //better success object reponse in utils
            }
        }
    } catch(err) {
        const error = ErrorResponse.buildErrObject(422, err.message);
    
        ErrorResponse.handleError(res, error);
    }
}

module.exports = {
    register,
}