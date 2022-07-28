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
        req = matchedData(req);
        const gatewayRegisteredData = await authSvc.checkDuplicateEmail(req, res);
        if(gatewayRegisteredData){
            req.gatewayUserID = gatewayRegisteredData.data.user._id;
            req.role = gatewayRegisteredData.data.user.role;
            // register user to local database
			const data = await authSvc.registerUser(req, res);
            if(data){
                // add verification code to user object when in developer mode
			    const userInfo = await authSvc.setUserAccountStatus(data, res);
                //Todo: add send register email
                emailSvc.sendRegistrationEmail(locale, userInfo, res);
                //Todo: add register token object
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
        const error = ErrorResponse.buildErrObject(422, err.message);
    
        ErrorResponse.handleError(res, error);
    }
}

module.exports = {
    register,
}