const express = require('express')
const router = express.Router();
const adminController = require('../app/controllers/AdminController');
const userController1 = require('../app/controllers/UserController1');

router.get('/user', userController1.getUserData)

router.get('/chart1',
    adminController.getChart1
)
router.get('/chart2',
    adminController.getChartAccount
)
router.get('/chartYear',
    adminController.getChartYear
)
module.exports = router;
