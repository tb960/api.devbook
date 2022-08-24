const i18n = require('i18n');
const nodemailer = require('nodemailer');


//public function
/**
 * Sends register verification email
 * author: Boon Khang
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
const sendRegistrationEmail = (locale, user) => {
	i18n.setLocale(locale);
	const subject = i18n.__('registration.SUBJECT');
	const htmlMessage = i18n.__('registration.MESSAGE');
	const options = {
		type: 'registration',
		verification: user.verification,
	}
	prepareToSendEmail(user, subject, htmlMessage, options);
}

/**
 * Sends forgot password email
 * author: Boon Khang
 * @param {string} locale - locale
 * @param {Object} data - data object
 */
const sendForgotPasswordEmail = (locale, user, data) => {
	i18n.setLocale(locale);
	const subject = i18n.__('forgotPassword.SUBJECT');
	const htmlMessage = i18n.__('forgotPassword.MESSAGE');
	const options = {
		type: 'forgotPassword',
		verification: data.verification,
	}
	prepareToSendEmail(user, subject, htmlMessage, options);
}

//private function
/**
 * Prepares to send email
 * author: Boon Khang
 * @param {string} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
const prepareToSendEmail = async (user, subject, htmlMessage, options) => {
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
		options,
	};
	//in development mode, we don't need to send email
	//only in production mode then we need to send email, we can manually change the code to test for development
	switch(process.env.NODE_ENV){
	case 'development':
		try{
			const messageSent = await sendEmail(emailData);
			if(!messageSent){
				console.log('EmailService(prepareToSendEmail): Email not sent, empty response from SMTP server!');
				// throw new ErrorResponse.ErrorHandler(
				// 	'EMAIL_NOT_SENT',
				// 	422,
				// 	'Registration verification email not sent!'
				// );
				//throw new Error(`Email failed to sent to: ${emailData.user.email}`);
			}
			//this next line should onlt appear in development mode
			if(messageSent){
				console.log(`Email sent to: ${emailData.user.email}`);
			}
		} catch(err) {
			//ErrorResponse.handleError(res, err);
			console.log('EmailService(prepareToSendEmail): An error occur while preparing registration email!');
			console.log(err.message);
			// throw new ErrorResponse.ErrorHandler(
			// 	'EMAIL_PREPARED_FAILED',
			// 	422,
			// 	'Failed to prepare registration verification email!',
			// 	err.message
			// );
		}
		break;
	case 'production':
		console.log(`This is development mode, email data is: ${emailData}`);
		break;
	default:
		console.log('Fail to prepare an email to send!');

	}
};


/**
 * Sends email
 * author: Boon Khang
 * @param {Object} data - data
 */
const sendEmail = async (data) => {
	const { user, subject, htmlMessage, options } = data;
	//the url need to be frontend for forgot password route
	//use a switch case here to identify the verification email or reset password email
	let url =  '';
	switch(options.type){
	case 'register':
		url = `http://localhost:3000/auth/verify/${options.verification}`;
		break;
	case 'forgotPassword':
		url = `http://localhost:3000/auth/resetPassword/${options.verification}`;
	}
	//experimental and change afterward
	const testMessage = `${htmlMessage} and the verify url is: ${url}`;
	//experimental
	const emails = ['khangtbk@gmail.com'];
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
			text: testMessage,
		}
		const mailStatus = await transporter.sendMail(mailOptions);
		if(!mailStatus){
			console.log('This is not mail status');
			console.log(mailStatus);
		}
		if(mailStatus){
			console.log('This is mail status');
			console.log(mailStatus);
		}
		return mailStatus;
	} catch (err) {
		console.log('EmailService(sendEmail): An error occur while sending registration email!');
		console.log(err.message);
		// throw new ErrorResponse.ErrorHandler(
		// 	'EMAIL_SENT_FAILED',
		// 	422,
		// 	'Unable to sent registration verification email to user!',
		// 	err.message
		// );
	}
};


module.exports = {
	sendRegistrationEmail,
	sendForgotPasswordEmail,
}
