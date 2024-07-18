const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication.js');
const { uploadResidentImages } = require('../middleware/multer.js');
const SessionController = require('../controllers/SessionController.js');

router.get('/', authentication, SessionController.allSessions);
router.get('/id/:_id', authentication, SessionController.findSessionById);
router.get('/residentid/:_id', authentication, SessionController.findSessionsByResidentId);
router.get('/activityid/:_id', authentication, SessionController.findSessionsByActivityId);
router.post('/', authentication, SessionController.createSession);
router.delete('/id/:_id', authentication, SessionController.deleteSession);

module.exports = router;
