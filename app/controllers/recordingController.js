//import services
const recordingSvc = require('../services/recordingService');

// import other
const ErrorResponse = require('../../utils/errorResponse');

/**
 * Upload Recording called by route
 * author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const uploadRecording = async (req, res) => {
	try {
		const filePath = req.file.path;
		const fileName = req.file.filename;
		console.log(`Uploading ${fileName} to azure from:`, filePath);
		const uploadedRes = await recordingSvc.uploadRecordingFromPath(filePath, fileName);
		console.log('Uploaded to file URL: ', uploadedRes.uploadedFileUrl, fileName);
		//Todo: build success response object
		const successPayload = {
			path: req.file.path,
			url: uploadedRes.uploadedFileUrl,
			clientRequestId: uploadedRes.clientRequestId,
			requestId: uploadedRes.requestId
		}
		res.status(200).json({
			statusCode: 200,
			...successPayload,
		}); //Todo: better success object reponse in utils
	} catch (err) {
		ErrorResponse.handleError(res, err);
	}
}

/**
 * Delete Recording called by route
 * author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const deleteRecording = async (req, res) => {
	try {
		const fileName = req.body.recording;
		const options = {
			deleteSnapshots: 'include' // or 'only'
		}
		const deletedRes = await recordingSvc.deleteRecordingFromAzure(options, fileName);
		const successPayload = {
			recording: fileName,
			url: deletedRes.uploadedFileUrl,
			clientRequestId: deletedRes.clientRequestId,
			requestId: deletedRes.requestId
		}
		res.status(200).json({
			statusCode: 200,
			...successPayload,
		}); //Todo: better success object reponse in utils

	} catch (err) {
		ErrorResponse.handleError(res, err);
	}
}

/**
 * Download Recording called by route
 * author: Boon Khang
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const downloadRecording = async (req, res) => {
	try {
		const fileName = req.body.recording;
		const downloadPath = './public/temp/test.mp4';
		const downloadRes = await recordingSvc.downloadRecordingFromAzure(downloadPath, fileName);
		const successPayload = {
			recording: fileName,
			url: downloadRes.fileUrl,
		}
		res.status(200).json({
			statusCode: 200,
			...successPayload,
		}); //Todo: better success object reponse in utils
	} catch (err) {
		ErrorResponse.handleError(res, err);
	}
}

module.exports = {
	uploadRecording,
	downloadRecording,
	deleteRecording,
}
