const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/ActivityController.js');
const { authentication, isAdmin } = require('../middleware/authentication.js');

router.post('/', authentication, isAdmin, ActivityController.createActivity);
router.put('/id/:_id', authentication, isAdmin, ActivityController.updateActivity);
router.get('/', ActivityController.allActivities);