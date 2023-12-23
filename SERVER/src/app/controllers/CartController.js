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


const getProductCart = async (req, res) => {
  try {
      // const userId = req.session.user_id || '650296d9b0f67d6e62bc49af';
      const userId = req.session.user_id || '650296d9b0f67d6e62bc49af';
      const user = await User.findOne({ _id: userId });

      if (!user || !user.cart) {
        console.log(user)
          res.status(404).json({ message: 'User or cart not found' });
          return;
      }

      const cartUser = await CartItem.findOne({ _id: user.cart.toString() }).populate({
          path: 'productItem.productId',
          populate: {
              path: 'variants.color',
              model: 'Color',
              select: 'nameColor image',
          },
      });

      if (cartUser) {
        console.log(cartUser)
          const productItemUser = cartUser.productItem;
          res.json({ productItemUser });
      } else {
        console.log(cartUser)

          res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
      }
  } catch (err) {
      console.error(err);
  }
};



// const addOrPutProductToCart = async (req, res, next) => {
//   try {
//     const { colorId, productId, size, quantityAction } = req.body;
//     console.log(1)
//     console.log(colorId, productId, size )
//     // const size2 =size.slice(0, 3).trim();
//     const size2 =size
//     console.log('s'+size2)
//     console.log(size)


//     const quantity = 1
//     const quantityColorNew = parseInt(quantityAction)
//     const p = await Product.findOne({_id:productId})
//     .populate({
//       path: "variants.color",
//       select: "nameColor imageColor"})
//     .lean();
    
//     const variant = p.variants.find(v => v.color._id.toString() === colorId);
//     const imageCart = variant ? variant.images[0] : [];
    
//     const colorFind = await Color.findOne({ _id: colorId });
//     const colorName = colorFind.nameColor;

//     const userId = req.session.user_id || '650296d9b0f67d6e62bc49af'

//     const userOri = await User.findOne({ _id: userId }).lean();
//     const cartUser = await CartItem.findOne({ _id: userOri.cart.toString() });
//     const userByCart = await User.findOne({ _id: userId }).populate('cart').lean();


//     const variantColorData = [{ size2, quantity: parseInt(quantity) }];
//     const variantData = { color: colorId, images: [imageCart], variantColor: variantColorData };
//     const newCartItem = { productId, variants: [variantData] };
//     console.log(colorId, productId, size2)

//     const existProductIndex = cartUser.productItem.findIndex(
//       (p) => p.productId.toString() === productId
//     );
//     if (existProductIndex === -1) {
//       cartUser.productItem.push(newCartItem);
//     } else {
//       const existingProduct = cartUser.productItem[existProductIndex];
//       const existColorIndex = existingProduct.variants.findIndex(
//         (v) => v.color._id.toString() === colorId
//       );
//       if (existColorIndex !== -1) {
//         const existingColor = existingProduct.variants[existColorIndex];
//         const existSizeIndex = existingColor.variantColor.findIndex(
//           (vc) => vc.size === size2
//         );
//         if (existSizeIndex !== -1) {
//           if(parseInt(quantityAction) >0){
//           console.log('Cộng dồn 1 hoặc nhiều sp')
//             console.log(parseInt(quantityAction))
//             existingColor.variantColor[existSizeIndex].quantity += parseInt(quantityAction);
//           }else if(parseInt(quantityAction) ===0){
//           console.log('Xóa sp')
//             // existingColor.variantColor[existSizeIndex].quantity =existingColor.variantColor[existSizeIndex].quantity + quantityAction;
//             existingColor.variantColor[existSizeIndex].quantity =0
//             console.log(existingColor.variantColor[existSizeIndex].quantity, '5')
//             console.log(existingColor)
//             await checkQuantity(cartUser, existingProduct, existingColor)
//             console.log('xóa xp 1')
//           }else{
//           console.log('Nút giảm')


//             existingColor.variantColor[existSizeIndex].quantity -= parseInt(quantity);
//             await checkQuantity(cartUser, existingProduct, existingColor)
//           }
//         } else {
//           console.log(quantityColorNew, quantityAction)
//           existingColor.variantColor.push({ size, quantity:quantityColorNew });
//         }
//       } else {
//         existingProduct.variants.push({
//           color: colorId,
//           images:[imageCart],
//           variantColor: [{ size, quantity }],
//         });
//       }
//     }
//     await cartUser.save();
//     console.log('11233api')
//     console.log(userByCart.cart)
//     res.json(userByCart.cart);
//   } catch (err) {
//     console.error(err);
//   }
// };
const checkQuantity= async(cartUser, productItem, productColor )=> {
  productColor.variantColor = productColor.variantColor.filter((vc) => vc.quantity > 0);
  productItem.variants = productItem.variants.filter((variant) => variant.variantColor.length > 0);
  cartUser.productItem = cartUser.productItem.filter((item) => item.variants.length > 0);
  console.log('1')
}

const addOrPutProductToCart = async (req, res, next) => {
  try {
    const { colorId, productId, size, quantityAction } = req.body;

    const size2 = size;
    const quantity = 1;
    const quantityColorNew = parseInt(quantityAction);

    const p = await Product.findOne({ _id: productId })
      .populate({
        path: "variants.color",
        select: "nameColor imageColor"
      })
      .lean();

    const variant = p.variants.find(v => v.color._id.toString() === colorId);
    const imageCart = variant ? variant.images[0] : [];

    const colorFind = await Color.findOne({ _id: colorId });
    const colorName = colorFind.nameColor;

    const userId = req.session.user_id || '650296d9b0f67d6e62bc49af';
    const userOri = await User.findOne({ _id: userId }).lean();
    const cartUser = await CartItem.findOne({ _id: userOri.cart.toString() });
    const userByCart = await User.findOne({ _id: userId }).populate('cart').lean();

    const variantColorData = [{ size2, quantity: parseInt(quantity) }];
    const variantData = { color: colorId, images: [imageCart], variantColor: variantColorData };
    const newCartItem = { productId, variants: [variantData] };

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
          if (parseInt(quantityAction) > 0) {
            existingColor.variantColor[existSizeIndex].quantity += parseInt(quantityAction);
          } else if (parseInt(quantityAction) === 0) {
            existingColor.variantColor[existSizeIndex].quantity = 0;
            await checkQuantity(cartUser, existingProduct, existingColor);
          } else {
            existingColor.variantColor[existSizeIndex].quantity -= parseInt(quantity);
            await checkQuantity(cartUser, existingProduct, existingColor);
          }
        } else {
          existingColor.variantColor.push({ size, quantity: parseInt(quantityAction) });
        }
      } else {
        if(parseInt(quantityAction)>1){
          
        } else{
          existingProduct.variants.push({
            color: colorName,
            images: [imageCart],
            variantColor: [{ size, quantity }],
          });

        }
      }
    }

    // Check version before saving
    const currentCart = await CartItem.findById(userOri.cart);
    if (cartUser.__v !== currentCart.__v) {
      res.status(409).json({ error: 'Version Conflict' });
      return;
    }

    await cartUser.save();
    res.json(userByCart.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  module.exports = {
    getProductCart,addOrPutProductToCart
}