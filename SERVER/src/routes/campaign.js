const express = require('express');
const router = express.Router();
const campaignController = require('../app/controllers/CampaignController');

router.post('/create-campaign', campaignController.createCampaign);
router.get('/products', campaignController.getProducts);


module.exports = router;
