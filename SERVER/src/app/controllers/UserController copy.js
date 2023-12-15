const User = require("../models/user");
const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// const randomstring = require("randomstring");
const { emailUser, emailPassword } = require("../../config/config");
const { Province, District, Ward } = require("../models/address");
const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");

const { getSlugData } = require("./ProductController");
const { Campaign } = require("../models/campaign");

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (err) {
    console.log(err.message);
  }
};

// const sendVerifyEmail = async (name, email, user_id) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//         user: emailUser,
//         pass: emailPassword,
//       },
//     });
//     const mailOptions = {
//       from: emailUser,
//       to: email,
//       subject: "For Verifycation Email",
//       html:
//         "<p> Hi " +
//         name +
//         ',please click here to <a href="http://localhost:3000/verify?id=' +
//         user_id +
//         '">Verify</a> your mail.</p>',
//     };
//     transporter.sendMail(mailOptions, function (err, info) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Email has been sent:-", info.response);
//       }
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// };
const loadRegister = async (req, res, next) => {
  try {
    res.render("users/registration");
  } catch (err) {
    console.log(err.message);
  }
};

const insertUser = async (req, res, next) => {
  try {
    const checkEmailExist = await User.findOne({ email: req.body.email });
    if (checkEmailExist) {
      res.status(200).send({
        message:
          "Your email have already, please login or use with other email",
      });
    }
    const spassword = await securePassword(req.body.password);
    const cart = new CartItem({
      productItem: [],
    });

    await cart.save();

    const user = new User({
      name: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      // image: req.file.filename,
      // image:
      password: spassword,
      is_admin: 0,
      cart: [cart._id],
    });

    const userData = await user.save();

    if (userData) {
      sendVerifyEmail(req.body.name, req.body.email, userData._id);
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

const verifyEmail = async (req, res) => {
  try {
    const updateInfo = await User.updateOne(
      { _id: req.query.id },
      { $set: { is_varified: 1 } }
    ).lean();
    console.log(updateInfo);
    res.render("users/email-verified");
  } catch (err) {
    console.log(err.message);
  }
};
//login user methods started
const loginLoad = async (req, res, next) => {
  try {
    let id = req.session.user_id;
    if (!id) {
      id = "64a6cf30c62a9a375636620e";
    }
    const userData = await User.findById({ _id: id }).lean();
    res.render("users/login", { user: userData });
  } catch (err) {
    console.log(err.message);
  }
};

const verifyLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        if (userData.is_varified === 0) {
          sendVerifyEmail(userData.name, userData.email, userData._id);
          res.status(200).send({
            message: "Please verify your email",
          });
        } else {
          req.session.user_id = userData._id;
          res.status(200).send({
            message: "Đăng nhập thành công",
          });
        }
      } else {
        res.status(200).send({
          message: "Email and password is incorrect",
        });
      }
    } else {
      res.send({ message: "Email is incorrect" });
    }
  } catch (err) {
    console.log(err.message);
  }
};
const loadHome = async (req, res, next) => {
  try {
    const userData = await User.findById({
      _id: req.session.user_id,
    }).lean();
    res.render("index", { user: userData });
    console.log(_id);
  } catch (err) {
    console.log(err.message);
  }
};

const loadProfile = async (req, res, next) => {
  try {
    const userData = await User.findById({
      _id: req.session.user_id,
    }).lean();
    res.render("users/profile", { user: userData });
    console.log(_id);
  } catch (err) {
    console.log(err.message);
  }
};

const userLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (err) {
    console.log(err.message);
  }
};

const forgetLoad = async (req, res) => {
  try {
    res.render("users/forget");
  } catch (err) {
    console.log(err.message);
  }
};
// const forgetVerify = async (req, res) => {
//   try {
//     const email = req.body.email;
//     const userData = await User.findOne({ email: email });
//     if (userData) {
//       if (userData.is_varified === 0) {
//         sendVerifyEmail(userData.name, userData.email, userData._id);
//         res.send( {
//           message: "Please verify your mail ",
//         });
//       } else {
//         const randomString = randomstring.generate();
//         const updatedData = await User.updateOne(
//           { email: email },
//           { $set: { token: randomString } }
//         ).lean();
//         sendResetPassword(userData.name, userData.email, randomString);
//         res.send( {
//           message: "Please check your mail to reset password.",
//         });
//       }
//     } else {
//       res.send({ message: "User email is incorrect" });
//     }
//   } catch (err) {
//     console.log(err.message);
//   }
// };
//for reset password send mail

// const sendResetPassword = async (name, email, token) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       requireTLS: true,
//       auth: {
//         user: emailUser,
//         pass: emailPassword,
//       },
//     });
//     const mailOptions = {
//       from: emailUser,
//       to: email,
//       subject: "For Reset Password",
//       html: `<p> Hi ${name}, please click <a href="http://localhost:4200/forgot-password?token=${token}&email=${email}">here</a> to reset your password.</p>`,
//     };
//     transporter.sendMail(mailOptions, function (err, info) {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("Email has been sent:-", info.response);
//       }
//     });
//   } catch (err) {
//     console.log(err.message);
//   }
// };
const forgetPasswordLoad = async (req, res, next) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token }).lean();
    if (tokenData) {
      res.render("users/forget-password", { user_id: tokenData._id });
    } else {
      res.render("users/404", { message: "Token is invalid." });
    }
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

//user profile edit
const editLoad = async (req, res, next) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id }).lean();
    if (userData) {
      res.render("users/edit", { user: userData });
    } else {
      redirect("./home");
    }
  } catch (err) {
    console.log(err.message);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    if (req.file) {
      const userData = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            image: req.file.filename,
          },
        }
      ).lean();
    } else {
      const userData = await User.findByIdAndUpdate(
        { _id: req.body.user_id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
          },
        }
      ).lean();
    }
    res.redirect("./home");
  } catch (err) {
    console.log(err.message);
  }
};

const index = async (req, res, next) => {
  try {
    const typeData = await Type.find({}).populate("subtypes");
    const resultArray = typeData.map((typeItem) => {
      return {
        typeName: typeItem.typeName,
        subtypes: typeItem.subtypes.map(
          (subtypeItem) => subtypeItem.subTypeName
        ),
      };
    });
    console.log(typeData);
    let product = await Product.find({})
      .populate({
        path: "variants.color",
        select: "nameColor imageColor",
      })
      .lean();
    const productDiscounts = await findCampaignProduct(req, res, next, product);
    product.forEach((p) => {
      if (productDiscounts[p._id.toString()]) {
        if (parseInt(productDiscounts[p._id].discount) === 11000) {
          p.discount = "+1sp";
        } else if (parseInt(productDiscounts[p._id].discount) === 2100) {
          p.discount = "2+1";
        } else {
          p.discount = `-${productDiscounts[p._id].discount}%`;
        }
      } else {
        p.discount = 0;
      }
    });
    // res.render('index', { typeData, product });//
    res.send({ data: product });
  } catch (error) {
    console.error("Error getting type and subtype data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const findCampaignProduct = async () => {
  try {
    const currentDate = new Date();
    const campaigns = await Campaign.find({
      startTime: { $lte: currentDate },
      endTime: { $gte: currentDate },
    }).lean();

    // console.log('Các chiến dịch đang diễn ra:');
    // console.log(campaigns,currentDate);
    const productDiscounts = {};

    campaigns.forEach((campaign) => {
      campaign.campaignProduct.forEach((productID) => {
        if (
          !productDiscounts[productID.productId.toString()] ||
          campaign.discountPercentage >
            productDiscounts[productID.productId.toString()].discount
        ) {
          productDiscounts[productID.productId.toString()] = {
            discount: campaign.discountPercentage,
            campaignID: campaign._id,
            quantitySale: campaign.quantity,
            quantityHasPurchaseToPId: productID.quantityHasPurchase,
          };
        }
      });
    });
    console.log(campaigns);

    return productDiscounts;
  } catch (err) {
    console.log(err);
  }
};

const address = async (req, res, next) => {
  try {
    const provinceCode = req.query.province;
    const province = await Province.find({ code: provinceCode }).lean();
  } catch (err) {
    console.log(err);
  }
};

const getProvince = async (req, res, next) => {
  try {
    const province = await Province.find({}).lean();
    const addressDetail = await Ward.find({}).lean();

    // console.log(province)
    res.render("users/address", { province, addressDetail });
  } catch (err) {
    console.log(err);
  }
};
const apiData = async (req, res, Model, queryParam) => {
  try {
    const id = req.query[queryParam];
    // console.log(id);
    const data = await Model.find({ parent_code: id }).lean();
    // console.log(data);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};

const apiDistrict = async (req, res) => {
  await apiData(req, res, District, "provinceId");
};

const apiWard = async (req, res) => {
  await apiData(req, res, Ward, "districtId");
};
const ExtJSON = require("mongodb-extjson");

const apiSearchAddress = async (req, res) => {
  try {
    const keySearch = req.query.keyAddress;
    //     if (keySearch) {
    // const regex = new RegExp(ExtJSON.stringify(new RegExp(keySearch, 'i')), 'i');
    // const response = await Ward.aggregate([
    //   {
    //     $match: { path_with_type: { $regex: regex } }
    //   }
    // ]);
    // res.json(response);

    //     }
    if (keySearch) {
      const response = await Ward.aggregate([
        {
          $match: { path_with_type: new RegExp(keySearch, "i") },
        },
      ]);
      res.json(response);
    }
  } catch (err) {
    console.log(err);
  }
};

const addressFormFromSearch = async (req, res) => {
  try {
    const valueAddress = req.query.valueAddress;
    console.log(valueAddress);
    const ward = await Ward.findOne({ path_with_type: valueAddress });
    console.log(ward);
    const district = await District.findOne({ code: ward.parent_code });
    console.log(district);
    const province = await Province.findOne({ code: district.parent_code });
    console.log(province);
    res.json({ ward, district, province });
  } catch (err) {
    console.log(err);
  }
};
const saveAddress = async (req, res) => {
  try {
    const province = req.body.province[0];
    const district = req.body.district[0];
    const ward = req.body.ward[0];
    console.log(province);
    console.log(district);
    console.log(ward);
    await User.findByIdAndUpdate(
      { _id: "64bd3b11e8dbc8f4c2dd8402" },
      { $set: { province: province, district: district, ward, ward } }
    );
    res.redirect("/address");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  verifyEmail,
  loginLoad,
  verifyLogin,
  loadHome,
  userLogout,
  forgetLoad,
  forgetVerify,
  sendResetPassword,
  forgetPasswordLoad,
  resetPassword,
  editLoad,
  updateProfile,
  index,
  loadProfile,
  address,
  getProvince,
  apiDistrict,
  apiWard,
  apiSearchAddress,
  addressFormFromSearch,
  saveAddress,
  findCampaignProduct,
};
