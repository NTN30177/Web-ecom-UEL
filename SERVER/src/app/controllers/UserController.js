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
      { $set: { is_verified: 1 } }
    ).lean();
    console.log(updateInfo);
    res.send(updateInfo);
  } catch (err) {
    console.log(err.message);
  }
};
  const verifyLogin = async (req, res, next) => {
    try {
      console.log('111')
      const { cus_account, cus_password } = req.body;
      const userData = await User.findOne({ email: cus_account });
      if (userData) {
        console.log(cus_account, cus_password)
        const passwordMatch = await bcrypt.compare(cus_password, userData.password);
        console.log(passwordMatch, cus_password, userData.password)
        if (passwordMatch) {
          if (userData.is_verified === 0) {
            console.log(userData._id.toString())
            sendVerifyEmail(userData.name, userData.email, userData._id.toString());
            res.send({ message: "Vui lòng xác minh emmail" });
            console.log( "Vui lòng xác minh emmail")
          } else {
            console.log('Đăng nhập thành công')
            req.session.user_id = userData._id;
            console.log(req.session.user_id)

            res.send({ message: "Đăng nhập thành công" });
          }
        } else {
          console.log('Đăng nhập thất bại')
          res.send({ message: "Đăng nhập thất bại" });
        }
      } else {
        res.send({ message: "Email is incorrect" });
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  

module.exports = {
  x,saveAccount, verifyEmail, verifyLogin
};
