const mongoose = require('mongoose');

const ForgotPasswordSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			lowercase: true,
			required: true,
		},
		verification: {
			type: String,
		},
		used: {
			type: Boolean,
			default: false,
		},
		ipRequest: {
			type: String,
		},
		browserRequest: {
			type: String
		},
		countryRequest: {
			type: String,
		},
		ipChanged: {
			type: String,
		},
		browserChanged: {
			type: String,
		},
		countryChanged: {
			type: String,
		},
	},
	{
		versionKey: false,
		timestamps: true,
	},
);

var ForgotPassword = mongoose.model('ForgotPassword', ForgotPasswordSchema);

module.exports = ForgotPassword;
