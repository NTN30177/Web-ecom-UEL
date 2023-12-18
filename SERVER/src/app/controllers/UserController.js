const { Address } = require("../models/address");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { emailUser, emailPassword } = require("../../config/config");
const { Province, District, Ward } = require("../models/address");
const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");

const { Campaign } = require("../models/campaign");
const x = async (req, res, next) => {
  try {
    console.log(1);
  } catch (err) {
    console.log(err);
  }
};

const saveAccount = async (req, res, next) => {
  try {
    console.log(req.body)
    const checkEmailExist = await User.findOne({ email: req.body.cus_email });
    if (checkEmailExist) {
      res.status(200).send({
        message:
          "Your email have already, please login or use with other email",
      });
    }
    const spassword = await securePassword(req.body.cus_password);
    const cart = new CartItem({
      productItem: [],
    });
    const address = new Address({
      addressDetail:req.body.cus_address_id,
      addressCode: req.body.cus_ward_id
    });
    await cart.save();
    await address.save();
    const nameAll = req.body.cus_firstname +' '+ req.body.cus_lastname
    const user = new User({
      name: nameAll,
      email: req.body.cus_email,
      mobile: req.body.cus_phonenumber,
      // image: req.file.filename,
      // image:
      password: spassword,
      is_admin: 0,
      cart: [cart._id],
      bilList:[],
      address:[address._id]
      
    });
    const userData = await user.save();
    if (userData) {
      sendVerifyEmail(nameAll, req.body.cus_email, userData._id);
      res.status(200).send({
        message:
          "Your registration has been successfully. Please verify your email",
        link: "1",
      });
    } else {
      res.send({
        message: "Your registeration has been failed.",
      });
    }
  } catch (err) {
    console.log(err.message);
  }
  
};
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    console.log(err.message);
  }
};
const sendVerifyEmail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "For Verifycation Email",
      html:
        "<p> Hi " +
        name +
        ',please click here to <a href="http://localhost:3000/verify?id=' +
        user_id +
        '">Verify</a> your mail.</p>',
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email has been sent:-", info.response);
      }
    });
  } catch (err) {
    console.log(err.message);
  }
};
const verifyEmail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_varified: 1 } }
    ).lean();
    console.log(updateInfo);
    res.render("http://localhost:4200/");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = {
  x,saveAccount, verifyEmail
};
