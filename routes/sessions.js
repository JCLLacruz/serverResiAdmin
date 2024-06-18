const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication.js');
const { uploadResidentImages } = require('../middleware/multer.js');
const SessionController = require('../controllers/SessionController.js');


router.get('/', SessionController.allSessions);
router.get('/id/:_id', SessionController.findSessionById);
router.post('/', SessionController.createSession);
router.delete('/id/:_id', SessionController.deleteSession);


module.exports = router;