const express = require('express')
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const userController1 = require('../app/controllers/UserController1');
// const upload = multer({ storage: storage });

router.get('/user', userController1.getUserData)
module.exports = router;
