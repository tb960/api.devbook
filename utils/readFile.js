const fs = require('fs');
const ErrorResponse = require('./errorResponse');

/**
 * read public key from local file systems
 * author: Boon Khang
 */
const readPublicKey = () => {
	try {
		// eslint-disable-next-line
        const publicKeyFilePath = `${__basedir}/gateway-key.pub`;
		const publicKey = fs.readFileSync(publicKeyFilePath).toString();

		return publicKey;
	} catch (err) {
		throw new ErrorResponse.ErrorHandler(
			'FAIL_TO_READ_PUBLIC_KEY',
			409,
			'public key reading fail',
			err.message
		);
	}
}

module.exports = {
	readPublicKey,
}
