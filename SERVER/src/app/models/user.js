const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      // required: true
    },
    gender: {
      type: Number,
      enum: [1, 2]
    },
    date_of_birth: {
      type: Date,
    },
    image: {
      type: String,
      default: "user.png",
      // required: true
    },
    is_admin: {
      type: Number,
      required: true,
    },
    is_verified: {
      type: Number,
      default: 0,
    },
    token: {
      type: String,
      default: "",
    },
    historySearch: {
      type: Array,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
    },
    addressList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAddress",
      },
    ],
    orderList: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const addressSchema = new mongoose.Schema(
  {
    is_default: {
      type: Boolean,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      // required: true
    },
    specific_address: {
      type: String,
    },
    ward: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
const UserAddress = mongoose.model("UserAddress", addressSchema);

module.exports = {
  User,
  UserAddress,
};
