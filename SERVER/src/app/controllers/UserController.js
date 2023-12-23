const { Address } = require("../models/address");
const {User, UserAddress} = require("../models/user");
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
    const address = new UserAddress({
      is_default:true,
      name:req.body.cus_lastname,
      phone:req.body.cus_phonenumber,
      specific_address:req.body.cus_address_id,
      ward: req.body.cus_ward_id
    });
    await cart.save();
    await address.save();
    const user = new User({
      first_name: req.body.cus_firstname,
      last_name: req.body.cus_lastname,
      email: req.body.cus_email,
      mobile: req.body.cus_phonenumber,
      gender: req.body.cus_gender,
      date_of_birth: req.body.cus_dob,
      // image: req.file.filename,
      // image:
      password: spassword,
      is_admin: 0,
      cart: [cart._id],
      orderList:[],
      addressList:[address._id]
      
    });
    const userData = await user.save();
    if (userData) {
      sendVerifyEmail(cus_lastname, req.body.cus_email, userData._id);
      res.status(200).send({
        message:
          "Your registration has been succesSsfully. Please verify your email",
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
        ',please click here to <a href="http://localhost:3000/user/verify?id=' +
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
            res.send({ message: "Vui lòng xác minh email" });
            console.log( "Vui lòng xác minh email")
          } else {
            req.session.user_id = userData._id;
            res.locals.userDataSession = await User.findById(
              req.session.user_id
          ).lean();
            console.log(req.session.user_id, '123')
            res.send({ message: "Đăng nhập thành công",userData:userData, login:true});
          }
        } else {
          res.send({ message: "Đăng nhập thất bại" });
        }
      } else {
        res.send({ message: "Email is incorrect" });
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  

  const getProductHomePage = async (req, res) => {
    try {
      let products = await Product.find({})
      .populate({
        path: "variants.color",
        select: "imageColor",
      })
      .lean();
      console.log('123')
      console.log(products)
      res.json({products });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const getForGotPW = async (req, res) => {
  try {
    console.log(123)
    const email = req.params.email;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const randomString = randomstring.generate();
      const updatedData = await User.updateOne(
        { email: email },
        { $set: { token: randomString } }
      ).lean();
      sendResetPassword(userData.name, userData.email, randomString);
      res.send( {
        message: "Please check your mail to reset password.", success:true
      });
    } else {
      res.send({ message: "User email is incorrect", success:false });
    }
  } catch (err) {
    console.log(err.message);
  }
};
//for reset password send mail

const sendResetPassword = async (name, email, token) => {
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
      subject: "For Reset Password",
      html: `<p> Hi ${name}, please click <a href="http://localhost:4200/forgot-pw?token=${token}&email=${email}">here</a> to reset your password.</p>`,
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
const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    console.log(password);
    const email = req.body.email;
    console.log(email)
    const secure_Password = await securePassword(password);
    const updatedData = await User.findOneAndUpdate(
      { email: email.toString() },
      { $set: { password: secure_Password, token: "" } }
    ).lean();
    res.send({message: 'Thay đổi mật khẩu thành công!'});
  } catch (err) {
    console.log(err.message);
  }
};



module.exports = {
  x,saveAccount, verifyEmail, verifyLogin, getProductHomePage, getForGotPW, resetPassword
};
