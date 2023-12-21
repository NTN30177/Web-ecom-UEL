const { Address } = require("../models/address");
const {User, UserAddress} = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { emailUser, emailPassword } = require("../../config/config");
const { Province, District, Ward } = require("../models/address");


const getAccountInfo = async (req, res) => {
    try {
      const userID = req.query.userID; // Assuming you're passing userID as a query parameter
      const userInfo = await User.findById(userID);
      res.status(200).json(userInfo);
    } catch (error) {
      console.error('Error fetching user account info:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
    getAccountInfo
  };
  