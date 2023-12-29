const { Address } = require("../models/address");
const { User, UserAddress } = require("../models/user");
const { Order } = require("../models/order");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { emailUser, emailPassword } = require("../../config/config");
const { Province, District, Ward } = require("../models/address");
const mongoose = require('mongoose');

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

const updateAccountInfo = async (req, res) => {
  const userID = req.params.userID;
  console.log(userID)
  const { first_name, last_name, phone, email, gender, date_of_birth } = req.body;
  try {
    const updateResult = await User.findByIdAndUpdate(userID, { $set: { first_name, last_name, phone, email, gender, date_of_birth } }, { new: true });
    res.status(200).json({ message: 'Cập nhật thành công.' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server.' });
  }
};

const { ObjectId } = require('mongoose').Types;

const getAccountAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log('Received userId:', userId);

    // Fetch the user with the given userId
    const user = await User.findById(userId).exec();
    // console.log('user doccument', user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.addressList || user.addressList.length === 0) {
      return res.status(404).json({ message: 'User has no addresses' });
    }


    console.log('addressListIds', user.addressList);

    // Fetch all addresses for the user
    const addresses = await UserAddress.aggregate([
      { $match: { _id: { $in: user.addressList } } },
      {
        $lookup: {
          from: 'wards', // Name of the ward collection
          localField: 'ward', // Field from the UserAddress collection
          foreignField: 'code', // Field from the Ward collection
          as: 'wardData',
        },
      },
      {
        $addFields: {
          'wardData': {
            $arrayElemAt: ['$wardData.path_with_type', 0],
          },
          'is_default': '$is_default',
          'name': '$name',
          'phone': '$phone',
          'specific_address': '$specific_address',
        },
      },
    ]);
    // Send the addresses to the client
    res.json(addresses);

  } catch (error) {
    console.error('Error fetching user account addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAccountOrder = async (req, res) => {
  try {
    const userId = req.params.userId;
    // console.log(userId, 'uiiiiiid')
    const user = await User.findById(userId).exec();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const orders = await Order.find({ _id: { $in: user.orderList } }).exec();
    // console.log('user orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const postUserAddress = async (req, res) => {
  try {
    const userID = req.params.userID;
    console.log(userID)
    const form = req.body;
    console.log(form)
    const formAddress = form.address
    // console.log('formAddress:', formAddress)
    const formUserID = form.userID
    // console.log('formUserID:', formUserID)

    const user = await User.findById(formUserID).exec();
    // console.log('User:',user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new UserAddress document
    const newAddress = new UserAddress({
      is_default: formAddress.isDefault,
      name: formAddress.fullName,
      phone: formAddress.phoneNumber,
      specific_address: formAddress.specific_address,
      ward: formAddress.ward,
    });

    // Save the new UserAddress document
    const savedAddress = await newAddress.save();

    // Get the ID of the newly created UserAddress
    const addressID = savedAddress._id;

    user.addressList.push(addressID);

    // Save the updated User document
    await user.save();

    res.status(200).json({ message: 'Address added successfully', user });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const getUserData = async (req, res) => {
  try {
    // Fetch user data
    const users = await User.find({}, '-password'); // Exclude password field
    const userData = [];

    for (const user of users) {
      const userWithOrders = await User.findById(user._id).populate('orderList');
      const orderList = userWithOrders.orderList;

      const totalRevenue = orderList.reduce((total, order) => total + order.totalPrice, 0);

      const latestOrder = orderList.reduce((latest, order) => {
        return order.createdAt > latest.createdAt ? order : latest;
      }, orderList[0]);

      userData.push({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        totalRevenue,
        latestPurchase: latestOrder ? latestOrder.createdAt : null,
        is_admin: user.is_admin,
      });
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAccountAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    // console.log("server - addressID needed deleting:", addressId)

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: 'Invalid addressId format' });
    }
    const result = await UserAddress.findByIdAndDelete(addressId);

    // Check if the address was found and deleted
    if (!result) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Send a success response
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const setDefaultAddress = async (req, res) => {
  const { userId, addressId } = req.body;

  try {
    // Find the user and update the addressList to set is_default to false for all addresses
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set is_default to false for all addresses of the user
    user.addressList.forEach(async (address) => {
      await UserAddress.findByIdAndUpdate(address, { is_default: false });
    });

    // Set is_default to true for the selected address
    const updatedAddress = await UserAddress.findByIdAndUpdate(
      addressId,
      { is_default: true },
      { new: true }
    );

    res.json(updatedAddress);
  } catch (error) {
    console.error('Error setting default address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getAccountInfo,
  updateAccountInfo,
  getAccountAddresses,
  postUserAddress,
  getAccountOrder,
  getUserData,
  deleteAccountAddress,
  setDefaultAddress,
  
};
