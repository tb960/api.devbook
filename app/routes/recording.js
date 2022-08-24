// import npm packages
const express = require('express');
const router = express.Router();

// import validators
const validators = require('../middleware/validate.recording');

// import controllers
const recordingController = require('../controllers/recordingController');

// import middlewares/ utils
const multer = require('../middleware/multer');
// import others

/*
 * POST /upload
 */
router.post('/upload', multer.uploadRecording, recordingController.uploadRecording);
/*
 * POST /download
 */
router.post('/download', multer.uploadNone, recordingController.downloadRecording);
/*
 * POST /delete
 */
router.post('/delete', multer.uploadNone, recordingController.deleteRecording);


module.exports = router;
