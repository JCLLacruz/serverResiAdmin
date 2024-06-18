const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication.js');
const { uploadResidentImages } = require('../middleware/multer.js');
const ResidentController = require('../controllers/ResidentController.js');

router.get('/', authentication, ResidentController.allResidents);
router.get('/id/:_id', authentication, ResidentController.findResidentById);
router.get('/firstname/:firstname', authentication, ResidentController.findResidentByName);
router.post('/', authentication, uploadResidentImages.single('image_path'), ResidentController.createResident);
router.put('/id/:_id', authentication, uploadResidentImages.single('image_path'), ResidentController.updateResident);
router.delete('/id/:_id', authentication, ResidentController.deleteResident);

module.exports = router;
