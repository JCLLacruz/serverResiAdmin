// routes/imageRoutes.js
const express = require('express');
const ImageController = require('../controllers/ImageController');
const multer = require('multer');
const { uploadProfileImages, uploadResidentImages } = require('../middleware/multer');
const { authentication } = require('../middleware/authentication');

const router = express.Router();
const upload = multer();

router.post('/upload/user',authentication, uploadProfileImages.single('image'), ImageController.uploadUserProfileImage);
router.post('/upload/resident',authentication, uploadResidentImages.single('image'), ImageController.uploadResidentImage);
router.get('/:id',authentication, ImageController.getImage);
router.delete('/delete/:_id',authentication, ImageController.deleteImage);

module.exports = router;
