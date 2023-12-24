// CampaignController.js
const { Campaign } = require('../models/campaign');
const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");


const createCampaign = async (req, res) => {
  try {
    // Assuming that req.body contains the campaign data from the client
    const campaignData = req.body;

    // Create a new campaign instance
    const newCampaign = new Campaign(campaignData);

    // Save the campaign to the database
    const savedCampaign = await newCampaign.save();

    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}, 'title'); // Lấy tên sản phẩm
    res.status(200).json(products);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    res.status(500).json({ error: 'Lỗi Nội bộ của máy chủ' });
  }
};

module.exports = {createCampaign, getProducts}