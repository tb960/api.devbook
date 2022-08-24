const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ['USER', 'ADMIN'],
			default: 'USER',
		},
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			select: false,
		},
		verification: {
			type: String,
		},
		userAccountStatus: {
			type: String,
			enum: ['NOTVERIFIED', 'VERIFIED', 'DISABLED'],
			default: 'NOTVERIFIED',
		},
		loginAttempts: {
			type: Number,
			default: 0,
		},
		blockExpireDate: {
			type: Date,
			default: Date.now,
		}
	}
);

UserSchema.pre('save', function(next){
	if(!this.isModified('password')){
		return next();
	}
	bcrypt.genSalt(5, (err, salt) => {
		if(err) {
			return next(err);
		}
		bcrypt.hash(this.password, salt, (err, hash) => {
			if(err) {
				return next(err);
			}
			this.password = hash;
			next();
		})
	})
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
