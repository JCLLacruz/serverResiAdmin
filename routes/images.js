// routes/imageRoutes.js
const express = require('express');
const ImageController = require('../controllers/ImageController');
const { uploadProfileImages, uploadResidentImages } = require('../middleware/multer');

const router = express.Router();
const upload = multer();

router.post('/upload/user', uploadProfileImages.single('image'), ImageController.uploadUserProfileImage);
router.post('/upload/user', uploadResidentImages.single('image'), ImageController.uploadResidentImage);
router.get('/:id', ImageController.getImage);

module.exports = router;
