const express = require('express')
const router = express.Router();
const userController = require('../app/controllers/UserController');
// const upload = multer({ storage: storage });


router.post('/register', 
// upload.single('image'),
 userController.saveAccount);//

 router.get('/verify', userController.verifyEmail);

module.exports = router;
