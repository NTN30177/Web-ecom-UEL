const express = require("express");
const router = express.Router();
const orderController = require("../app/controllers/OrderController");
const cartController = require("../app/controllers/CartController");

router.get("/product/:userId", cartController.getProductCart);
router.put("/product/:userId", cartController.addOrPutProductToCart);
router.post("/saveOrder", orderController.saveOrder);

module.exports = router;
