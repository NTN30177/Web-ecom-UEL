const express = require('express')
const router = express.Router();
const userController = require('../app/controllers/UserController');
const userController1 = require('../app/controllers/UserController1');
// const upload = multer({ storage: storage });


router.post('/register',
    // upload.single('image'),
    userController.saveAccount);//

router.get('/verify', userController.verifyEmail);
router.get('/id', userController.getUserID);
router.post('/login', userController.verifyLogin);

router.get('/account/info', userController1.getAccountInfo)

module.exports = router;
