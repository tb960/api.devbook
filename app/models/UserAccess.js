const mongoose = require('mongoose');

const UserAccessSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			lowercase: true,
			required: true,
		},
		ip: {
			type: String,
			require: true,
		},
		browser: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
		}
	},
	{
		versionKey: false,
	},
);

var UserAccess = mongoose.model('UserAccess', UserAccessSchema);

module.exports = UserAccess;
