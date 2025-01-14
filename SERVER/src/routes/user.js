const express = require("express");
const router = express.Router();
const userController = require("../app/controllers/UserController");
const userController1 = require("../app/controllers/UserController1");
// const upload = multer({ storage: storage });

router.post(
  "/register",
  // upload.single('image'),
  userController.saveAccount
); //

router.get("/verify", userController.verifyEmail);
router.get("/id", userController.getUserID);
router.post("/login", userController.verifyLogin);
router.get("/product", userController.getProductHomePage);
router.get("/forgot-pw/:email", userController.getForGotPW);
router.get("/is-email-verified/:email", userController.isEmailVerified);

router.get("/account/info", userController1.getAccountInfo);
router.put("/account/info/update/:userID", userController1.updateAccountInfo);
router.post("/account/address/add-address", userController1.postUserAddress);
router.get("/account/address/:userId", userController1.getAccountAddresses);
router.get("/account/order/:userId", userController1.getAccountOrder);

router.delete(
  "/account/address/:addressId",
  userController1.deleteAccountAddress
);

router.put("/account/address/set-default", userController1.setDefaultAddress);

router.get("/types-populate-subtypes", userController.subTypeApi);
router.get("/validateEmail", userController.verifyEmail);
router.post("/resetPassW", userController.resetPassword);

module.exports = router;
