const express = require('express');
const ServerController = require('../controllers/ServerController');

const router = express.Router();
const upload = multer();

router.get('/status',ServerController.serverStatus);

module.exports = router;
