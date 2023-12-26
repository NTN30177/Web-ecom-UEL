const express = require("express");
const router = express.Router();
const orderController = require("../app/controllers/OrderController");

router.get("/order-details/:orderId", orderController.orderDetail);
router.post("/saveOrder", orderController.saveOrder);

module.exports = router;
