const express = require("express");
const router = express.Router();
const cartController = require("../app/controllers/CartController");

router.get("/product/:userId", cartController.getProductCart);
router.put("/product/:userId", cartController.addOrPutProductToCart);

module.exports = router;
