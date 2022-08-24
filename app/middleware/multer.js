const multer = require('multer');

//helper function
/**
 * get the storage object for multer upload
 * @param {Object} destPath - public path in local storage
 */
const getStorageObject = (destPath) => {
	return multer.diskStorage({
		destination: destPath,
		filename: (req, file, callback) => {
			const fileArray = file.originalname.split('.');
			fileArray.splice(0, 1, `${fileArray[0][0]}-${Date.now()}`);
			callback(null, fileArray.join('.'));
		}
	})
}

/**
 * filter file by Mime Type
 * @param {Object} types - public path in local storage
 */
const filterFileByMime = (types) => {
	return (req, file, callback) => {
		if (types.indexOf(file.mimetype.split('/')[0]) === -1) {
			return callback(
				`Error - Only ${types.join(',')} files supported. Received ${file.mimetype}`,
			);
		}
		return callback(null, true);
	}
}

/**
 * multer used by normal route
 */
const uploadNone = multer().none();

/**
 * multer used for upload recording video files
 */
const uploadRecording = multer({
	storage: getStorageObject('public/temp/'),
	fileFilter: filterFileByMime(['audio', 'video']),
}).single('recording');



module.exports = {
	uploadNone,
	uploadRecording,
}
