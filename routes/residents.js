const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication.js');
const { uploadResidentImages } = require('../middleware/multer.js');
const ResidentController = require('../controllers/ResidentController.js');


router.post('/', uploadResidentImages.single('image_path'), ResidentController.createResident);


module.exports = router;