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

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            // unique: true,
            trim: true,
            // required: true,
        },
        slug: { type: String, maxLength: 255, slug: 'title', unique: true },
        price: {
            type: Number,
        },
        sku: {
            type: String,
        },
        discount: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            // required: true,
        },
        author: {
            type: String,
            // required: true,
        },
        images: [
            {
                type: String,
                // required: true, // You can add this validation if images are required
            },
        ],
        variants: [variantSchema],
        is_deleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

const subtypeSchema = new mongoose.Schema(
  {
    subTypeName: {
      type: String,
      // required: true,
    },
    slug: {
      type: String,
      maxLength: 255,
      slug: "subTypeName",
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const typeSchema = new mongoose.Schema(
  {
    typeName: {
      type: String,
      // required: true,
    },
    slug: { type: String, maxLength: 255, slug: "typeName", unique: true },
    subtypes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subtype",
      },
    ],
  },
  {
    timestamps: true,
  }
);

//Mua hàng

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  variants: [variantSchema],
});

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
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
    feedback:{
        type:String,
    },

  },
  {
    timestamps: true,
  }
);

//Giỏ hàng

const cartItemSchema = new mongoose.Schema({
  productItem: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      variants: [variantSchema],
    },
  ],
});

const colorSchema = new mongoose.Schema({
  nameColor: {
    type: String,
  },
  image: {
    type: String,
  },
});
const Variant = mongoose.model("Variant", variantSchema);
const VariantColor = mongoose.model("VariantColor", variantColorSchema);

const Product = mongoose.model("Product", productSchema);
const Subtype = mongoose.model("Subtype", subtypeSchema);
const Type = mongoose.model("Type", typeSchema);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
const Order = mongoose.model("Order", orderSchema);

const CartItem = mongoose.model("CartItem", cartItemSchema);
// const Cart = mongoose.model('Cart', cartSchema);
const Color = mongoose.model("Color", colorSchema);

module.exports = {
  Variant,
  VariantColor,

  Product,
  Subtype,
  Type,

  OrderItem,
  Order,

  CartItem,
  // Cart,

  Color,
};
