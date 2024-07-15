// routes/imageRoutes.js
const express = require('express');
const ImageController = require('../controllers/ImageController');
const { uploadProfileImages, uploadResidentImages } = require('../middleware/multer');
const { authentication } = require('../middleware/authentication');

const router = express.Router();
const upload = multer();

router.post('/upload/user',authentication, uploadProfileImages.single('image'), ImageController.uploadUserProfileImage);
router.post('/upload/user',authentication, uploadResidentImages.single('image'), ImageController.uploadResidentImage);
router.get('/:id',authentication, ImageController.getImage);

module.exports = router;
