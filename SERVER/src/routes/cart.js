const express = require("express");
const router = express.Router();
const cartController = require("../app/controllers/CartController");

router.get("/product", cartController.getProductCart);
router.put("/product", cartController.addOrPutProductToCart);

module.exports = router;
