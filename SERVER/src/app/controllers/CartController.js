const { Address } = require("../models/address");
const {User, UserAddress} = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const { emailUser, emailPassword } = require("../../config/config");
const { Province, District, Ward } = require("../models/address");
const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");


const getProductCart = async(req, res) => {
  try{
    const userId = req.session.user_id || '64d600df4aa3bbbf4a81e6d2'
    // const user = await User.findOne({_id:userId})
    // const cartUser = await CartItem.findOne({_id:user.cart.toString()}).populate({
      const cartUser = await CartItem.findOne({ _id: '64d600df4aa3bbbf4a81e6d0' }).populate({
        path: 'productItem.productId',
        populate: {
          path: 'variants.color',
          model: 'Color',
          select: 'nameColor image',
        },
      });
      console.log(cartUser)
      const productItemUser=cartUser.productItem
      // console.log(productItemUser)
    res.json({productItemUser})
  }catch(err){
    console.error(err);
  }
}


const addOrPutProductToCart = async (req, res, next) => {
  try {
    const { colorId, productId, size, quantityAction } = req.body;
    console.log(1)
    console.log(colorId, productId, size )
    const size2 =size.slice(0, 3).trim();
    console.log('s'+size2)
    console.log(size)


    const quantity = 1
    const p = await Product.findOne({_id:productId})
    .populate({
      path: "variants.color",
      select: "nameColor imageColor"})
    .lean();
    
    const variant = p.variants.find(v => v.color._id.toString() === colorId);
    const imageCart = variant ? variant.images[0] : [];
    
    const colorFind = await Color.findOne({ _id: colorId });
    const colorName = colorFind.nameColor;

    const userId = req.session.user_id || '64d600df4aa3bbbf4a81e6d2'

    const userOri = await User.findOne({ _id: userId }).lean();
    const cartUser = await CartItem.findOne({ _id: userOri.cart.toString() });
    const userByCart = await User.findOne({ _id: userId }).populate('cart').lean();


    const variantColorData = [{ size2, quantity: parseInt(quantity) }];
    const variantData = { color: colorId, images: [imageCart], variantColor: variantColorData };
    const newCartItem = { productId, variants: [variantData] };
    console.log(colorId, productId, size2)

    const existProductIndex = cartUser.productItem.findIndex(
      (p) => p.productId.toString() === productId
    );
    if (existProductIndex === -1) {
      cartUser.productItem.push(newCartItem);
    } else {
      const existingProduct = cartUser.productItem[existProductIndex];
      const existColorIndex = existingProduct.variants.findIndex(
        (v) => v.color._id.toString() === colorId
      );
      if (existColorIndex !== -1) {
        const existingColor = existingProduct.variants[existColorIndex];
        const existSizeIndex = existingColor.variantColor.findIndex(
          (vc) => vc.size === size2
        );
        if (existSizeIndex !== -1) {
          if(parseInt(quantityAction) >= 1){
            console.log(parseInt(quantityAction))
            existingColor.variantColor[existSizeIndex].quantity += parseInt(quantity);
          }else if(parseInt(quantityAction) ===0){
            // existingColor.variantColor[existSizeIndex].quantity =existingColor.variantColor[existSizeIndex].quantity + quantityAction;
            existingColor.variantColor[existSizeIndex].quantity =0
            await checkQuantity(cartUser, existingProduct, existingColor)
          }else{
            existingColor.variantColor[existSizeIndex].quantity -= parseInt(quantity);
            await checkQuantity(cartUser, existingProduct, existingColor)
          }
        } else {
          existingColor.variantColor.push({ size, quantity });
        }
      } else {
        existingProduct.variants.push({
          color: colorId,
          images:[imageCart],
          variantColor: [{ size, quantity }],
        });
      }
    }
    await cartUser.save();
    res.json(userByCart.cart);
  } catch (err) {
    console.error(err);
  }
};
const checkQuantity= async(cartUser, productItem, productColor )=> {
  productColor.variantColor = productColor.variantColor.filter((vc) => vc.quantity > 0);
  productItem.variants = productItem.variants.filter((variant) => variant.variantColor.length > 0);
  cartUser.productItem = cartUser.productItem.filter((item) => item.variants.length > 0);
}

  module.exports = {
    getProductCart,addOrPutProductToCart
}