const passport = require('passport');
const passportStrategy = require('../../config/passport');

//passport use
passport.use(passportStrategy.jwtAuthenticate);


/**
 * passport requireAuth method to authenticate using jwt
 */
const applyJwtAuth = passport.authenticate('jwt',
	{ session: false, }
);


module.exports = {
	applyJwtAuth,
}
