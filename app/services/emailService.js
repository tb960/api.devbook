const i18n = require('i18n');
const ErrorResponse = require('../../utils/errorResponse');
const nodemailer = require('nodemailer');


//public function 
/**
 * Sends register verification email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
const sendRegistrationEmail = (locale, user) => {
    i18n.setLocale(locale);
    const subject = i18n.__('registration.SUBJECT');
    const htmlMessage = i18n.__('registration.MESSAGE');
    prepareToSendEmail(user, subject, htmlMessage);
}



//private function
/**
 * Prepares to send email
 * @param {string} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
 const prepareToSendEmail = async (user, subject, htmlMessage) => {
	user = {
		username: user.username,
		email: user.email,
		verification: user.verification,
        userAccountStatus: user.userAccountStatus,
	};
	const emailData = {
		user,
		subject,
		htmlMessage,
	};
    //in development mode, we don't need to send email
    //only in production mode then we need to send email, we can manually change the code to test for development
    switch(process.env.NODE_ENV){
        case 'development':
            try{
                const messageSent = await sendEmail(emailData);
                if(!messageSent){
                    throw new Error(`Email failed to sent to: ${emailData.user.email}`);
                }
                console.log(`Email sent to: ${emailData.user.email}`);
    
            } catch(err) {
                const error = ErrorResponse.buildErrObject(422, err.message);
        
                ErrorResponse.handleError(res, error);
            }
            break;
        case 'production':
            console.log(`This is development mode, email data is: ${emailData}`);
            break;
        default:
            console.log("Fail to prepare an email to send!");

    }
};


/**
 * Sends email
 * @param {Object} data - data
 */
 const sendEmail = async (data) => {
    const { user, subject, htmlMessage } = data;
    const emails = ["khangtbk@gmail.com"];
    const transportAuth = {
        host: process.env.EMAIL_SMTP_SERVER,
        port: process.env.EMAIL_SMTP_SERVER_PORT,
        auth: {
            user: process.env.EMAIL_SMTP_DOMAIN_USER,
            pass: process.env.EMAIL_SMTP_KEY
        }
    }
    try{
        const transporter = nodemailer.createTransport(transportAuth);
        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: emails,
            subject: subject,
            text: htmlMessage,
        }
        const mailStatus = await transporter.sendMail(mailOptions);
        if(!mailStatus){
            console.log("This is not mail status");
            console.log(mailStatus);
        }
        if(mailStatus){
            console.log("This is mail status");
            console.log(mailStatus);
        }
        return false;
    } catch (err) {
        const error = ErrorResponse.buildErrObject(422, err.message);
        
        ErrorResponse.handleError(res, error);
    }
};


module.exports = {
    sendRegistrationEmail,
}