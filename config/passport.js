const JwtStrategy = require('passport-jwt').Strategy;
const readFile = require('../utils/readFile');
const User = require('../app/models/User');


//private function
/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string} token - decrypted token
 */
const jwtExtractor = req => {
	let token = null;
	if (req.headers.authorization) {
		token = req.headers.authorization.replace('Bearer ', '').trim();
	} else if (req.body.token) {
		token = req.body.token.trim();
	} else if (req.query.token) {
		token = req.query.token.trim();
	}
	return token;
}

/**
 * Options object for jwt middlware
 */
const jwtOptions = {
	jwtFromRequest: jwtExtractor,
	secretOrKey: readFile.readPublicKey(),
}

/**
 * authenticate with JWT middleware
 */
const jwtAuthenticate = new JwtStrategy(
	jwtOptions,
	(payload, done) => {
		User.findById(payload.sub, (err, user) => {
			if (err) {
				return done(err, false);
			}
			return !user ? done(null, false) : done(null, user);
		});
	}
);




module.exports = {
	jwtAuthenticate,
}
