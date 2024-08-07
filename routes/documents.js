const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication.js');
const DocumentController = require('../controllers/DocumentController.js');

router.post('/monthresume',authentication, DocumentController.monthResume);

module.exports = router;
