const express = require('express');
const router = express.Router();
const { authentication, isAdmin } = require('../middleware/authentication.js');
const { uploadResidentImages } = require('../middleware/multer.js');
const UserController = require('../controllers/UserController.js');

router.get('/', authentication, UserController.allUsers);
router.get('/id/:_id', authentication, UserController.findUserById);
router.get('/userinfo', authentication, UserController.userInfo);
router.get('/firstname/:firstname', authentication, UserController.findUserByFirstname);
router.get('/recoverpassword/:email', UserController.recoverPassword);
router.post('/login', UserController.login);
router.get('/logout', authentication, UserController.logout);
router.post('/', authentication, isAdmin, UserController.createUser);
router.put('/id/:_id', authentication, isAdmin, UserController.updateUser);
router.put('/resetpassword/:recoverToken', UserController.resetPassword);
router.delete('/id/:_id', authentication, isAdmin, UserController.deleteUser);

module.exports = router;
