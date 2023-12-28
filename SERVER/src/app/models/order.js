const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const variantColorSchema = new mongoose.Schema({
  size: String,
  quantity: {
    type: Number,
  },
});

// Định nghĩa schema cho dữ liệu variant
const variantSchema = new mongoose.Schema({
  color: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Color",
  },
  images: [
    {
      type: String,
      // required: true, // You can add this validation if images are required
    },
  ],
  variantColor: [variantColorSchema],
});

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  variants: [variantSchema],
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderItems: [orderItemSchema],
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAddress",
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Đang xử lý",
    },
    totalPrice: {
      type: Number,
    },
    totalQuantity: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
const Order = mongoose.model("Order", orderSchema);
module.exports = {
  OrderItem,
  Order,
};
