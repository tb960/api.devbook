const fs = require('fs');
const connectAzure = require('../../config/azure');
const ErrorResponse = require('../../utils/errorResponse');

//const variables
const defaultRecordingContainerName = 'recordings';
const recordingContainerName = process.env.AZURE_BLOB_STORAGE_RECORDING_CONTAINER || defaultRecordingContainerName;
const blobServiceClient = connectAzure.connectBlob();

/*
 *	CRUD (Private function)
 */

/**
 * upload recording in public temp folder to azure
 * author: Boon Khang
 * @param {Object} path - local path
 * @param {Object} recordingName - name of recording to upload to azure
 */
const uploadRecordingFromPath = async (path, recordingName) => {
	try {
		const content = await fs.readFileSync(path);

		const recordingContainerClient = blobServiceClient.getContainerClient(recordingContainerName);
		const blockBlobClient = recordingContainerClient.getBlockBlobClient(recordingName);
		const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
		const uploadResponse = {
			fileUrl: blockBlobClient.url,
			clientRequestId: uploadBlobResponse.clientRequestId,
			requestId: uploadBlobResponse.requestId
		}

		return uploadResponse;
	} catch (err) {
		throw new ErrorResponse.ErrorHandler(
			'AZURE_UPLOAD_FAILED',
			422,
			'Unable to upload recordings to azure database',
			err.message,
		);
	}
}

/**
 * download recording from azure
 * author: Boon Khang
 * @param {Object} downloadPath - local path
 * @param {Object} fileName - name of recording to download from azure
 */
const downloadRecordingFromAzure = async (downloadPath, fileName) => {
	try {
		const recordingContainerClient = blobServiceClient.getContainerClient(recordingContainerName);
		const blockBlobClient = await recordingContainerClient.getBlockBlobClient(fileName);
		//const downloadedBlobResponse = await blockBlobClient.downloadToFile(downloadPath);
		const downloadResponse = {
			fileUrl: blockBlobClient.url,
			// clientRequestId: downloadedBlobResponse.clientRequestId,
			// requestId: downloadedBlobResponse.requestId
		}

		return downloadResponse;
	} catch (err) {
		throw new ErrorResponse.ErrorHandler(
			'AZURE_DOWNLOAD_FAILED',
			422,
			'Unable to download recording from azure database',
			err.message,
		);
	}
}

/**
 * delete recording in azure
 * author: Boon Khang
 * @param {Object} options - includ or only delete snapshots
 * @param {Object} fileName - name of recording in azure
 */
const deleteRecordingFromAzure = async (options, fileName) => {
	try {
		const recordingContainerClient = blobServiceClient.getContainerClient(recordingContainerName);
		const blockBlobClient = await recordingContainerClient.getBlockBlobClient(fileName);
		const deletedBlobResponse = await blockBlobClient.delete(options);
		const deleteResponse = {
			deletedFileUrl: blockBlobClient.url,
			clientRequestId: deletedBlobResponse.clientRequestId,
			requestId: deletedBlobResponse.requestId
		}

		return deleteResponse;
	} catch (err) {
		throw new ErrorResponse.ErrorHandler(
			'AZURE_DELETE_FAILED',
			422,
			'Unable to delete recording from azure database',
			err.message,
		);
	}
}


module.exports = {
	uploadRecordingFromPath,
	downloadRecordingFromAzure,
	deleteRecordingFromAzure,
}
