const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "user.png",
      // required: true
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
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
    historySearch: [
      {
        type: String,
      },
    ],
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    // district: {
    //     type: String,
    //     default: '',
    // },
    // ward: {
    //     type: String,
    //     default: '',
    // },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
    },
    billList: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
