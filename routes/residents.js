const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication.js');
const { uploadResidentImages } = require('../middleware/multer.js');
const ResidentController = require('../controllers/ResidentController.js');


router.get('/', ResidentController.allResidents);
router.get('/id/:_id', ResidentController.findResidentById);
router.get('/firstname/:firstname', ResidentController.findResidentByName);
router.post('/', uploadResidentImages.single('image_path'), ResidentController.createResident);
router.put('/id/:_id', uploadResidentImages.single('image_path'), ResidentController.updateResident);
router.delete('/id/:_id', ResidentController.deleteResident);


module.exports = router;