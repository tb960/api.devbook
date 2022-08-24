const { BlobServiceClient } = require('@azure/storage-blob');

const defaultRecordingContainerName = 'recordings';
const defaultTranscriptContainerName = 'transcripts';

const connectionString = process.env.AZURE_BLOB_STORAGE_CONN_STRING;
const recordingContainerName = process.env.AZURE_BLOB_STORAGE_RECORDING_CONTAINER || defaultRecordingContainerName;
const transcriptContainerName = process.env.AZURE_BLOB_STORAGE_TRANSCRIPT_CONTAINER || defaultTranscriptContainerName;

const checkConnectionString = () => {
	let azureStatus = '';
	try {
		if(!connectionString){
			throw new Error('Azure Connection String undefined!');
		}
	} catch (error) {
		azureStatus = `*    Error connecting to AZURE: ${error.message}\n`;
		console.log(azureStatus);
		process.exit(1);
	}
}

const connectBlob = () => {
	return BlobServiceClient.fromConnectionString(connectionString);
}

const initAzure = () => {
	checkConnectionString();
	const blobServiceClient = connectBlob();

	const connectAzure = async () => {
		try {
			// Containers that need to be available
			const requiredContainerNames = [
				recordingContainerName,
				transcriptContainerName,
			];
			// TODO(zerefwayne) Improve logging
			for (const containerName of requiredContainerNames) {
				const containerServiceClient = blobServiceClient.getContainerClient(
					containerName,
				);
				const data = await containerServiceClient.createIfNotExists();
				await containerServiceClient.setAccessPolicy('blob');
				console.log(`*  Initialized Azure storage container: ${containerName}`);
			}
			return true;
		} catch (error) {
			console.log(error);
		}
	}

	const runConnectAzure = async () => {
		try{
			const connection = await connectAzure();
			if(connection){
				console.log('*  Successfully initialized Azure Storage Client');
				const recordingContainerClient = blobServiceClient.getContainerClient('recordings');
				const transcriptsContainerClient = blobServiceClient.getContainerClient('transcripts');
				//list most recent 10 blobs to show azure connection ok
				let i = 1, j = 1;
				const recordingBlobs = recordingContainerClient.listBlobsFlat();
				const transcriptBlobs = transcriptsContainerClient.listBlobsFlat();
				for await (const blob of recordingBlobs){
					console.log(`RecordingBlob ${i++}: ${blob.name}`);
				}
				// for await (const blob of transcriptBlobs){
				// 	console.log(`TranscriptBlob ${j++}: ${blob.name}`);
				// }
			}
		} catch (error) {
			console.log(error);
		}
	}
	runConnectAzure();
}

module.exports = {
	connectBlob,
	initAzure,
}
