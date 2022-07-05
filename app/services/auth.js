/**
 * Registers a new user in database
 * @param {Object} req - request object
 */
const registerUser = async req => {
	return new Promise((resolve, reject) => {
		const user = new User({
			_id: req.gatewayUserID,
			name: req.name,
			email: req.email,
			password: req.password,
			verification: uuid.v4(),
		});
		user.save((err, item) => {
			if (err) {
				reject(utils.buildErrObject(422, err.message));
			}
			resolve(item);
		});
	});
};