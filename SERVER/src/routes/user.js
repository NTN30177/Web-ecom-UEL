const express = require('express')
const router = express.Router();
const userController = require('../app/controllers/UserController');
const userController1 = require('../app/controllers/UserController1');
// const upload = multer({ storage: storage });


router.post('/register',
    // upload.single('image'),
    userController.saveAccount);//

router.get('/verify', userController.verifyEmail);
router.post('/login', userController.verifyLogin);

router.get('/account/info', userController1.getAccountInfo)
router.put('/account/info/update/:userID', userController1.updateAccountInfo);

router.get('/account/address/:userId', userController1.getAccountAddresses)
router.post('/account/address/add-address', userController1.postUserAddress)

module.exports = router;
