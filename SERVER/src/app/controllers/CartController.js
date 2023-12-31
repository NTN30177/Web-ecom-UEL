const { User, UserAddress } = require("../models/user");
const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");

const getProductCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(userId, "UID");
    const user = await User.findOne({ _id: userId });

    if (!user || !user.cart) {
      console.log(user);
      res.status(404).json({ message: "User or cart not found" });
      return;
    }

    const cartUser = await CartItem.findOne({
      _id: user.cart.toString(),
    })
      .populate({
        path: "productItem.productId",
        populate: {
          path: "variants.color",
          model: "Color",
          select: "nameColor imageColor",
        },
      })
      .populate({
        path: "productItem.variants.color",
        model: "Color",
        select: "nameColor imageColor",
      });

    if (cartUser) {
      console.log(cartUser);
      const productItemUser = cartUser.productItem;
      res.json({ productItemUser });
    } else {
      console.log(cartUser);

      res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }
  } catch (err) {
    console.error(err);
  }
};

const checkQuantity = async (cartUser, productItem, productColor) => {
  productColor.variantColor = productColor.variantColor.filter(
    (vc) => vc.quantity > 0
  );
  productItem.variants = productItem.variants.filter(
    (variant) => variant.variantColor.length > 0
  );
  cartUser.productItem = cartUser.productItem.filter(
    (item) => item.variants.length > 0
  );
  // console.log("1");
};

const addOrPutProductToCart = async (req, res, next) => {
  try {
    const { colorId, productId, size, quantityAction } = req.body;
    console.log(colorId, productId, size, quantityAction);

    const userId = req.params.userId;
    console.log(userId, "UID");
    const size2 = size;
    const quantity = 1;

    const p = await Product.findOne({ _id: productId })
      .populate({
        path: "variants.color",
        select: "nameColor imageColor",
      })
      .lean();
    const variant = p.variants.find((v) => {
      const variantColorId = v.color._id.toString();
      const providedColorId = colorId.toString();

      // console.log("Variant Color ID:", variantColorId);
      // console.log("Provided Color ID:", providedColorId);

      return variantColorId === providedColorId;
    });

    const imageCart = variant ? variant.images[0] : [];
    const colorFind = await Color.findOne({ _id: colorId });
    const userOri = await User.findOne({ _id: userId }).lean();
    const cartUser = await CartItem.findOne({ _id: userOri.cart.toString() });
    const userByCart = await User.findOne({ _id: userId })
      .populate("cart")
      .lean();

    const variantColorData = [{ size: size2, quantity: parseInt(quantity) }];
    const variantData = {
      color: colorId,
      images: [imageCart],
      variantColor: variantColorData,
    };
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
            existingColor.variantColor[existSizeIndex].quantity +=
              parseInt(quantityAction);
          } else if (parseInt(quantityAction) === 0) {
            existingColor.variantColor[existSizeIndex].quantity = 0;
            await checkQuantity(cartUser, existingProduct, existingColor);
          } else {
            existingColor.variantColor[existSizeIndex].quantity -=
              parseInt(quantity);
            await checkQuantity(cartUser, existingProduct, existingColor);
          }
        } else {
          existingColor.variantColor.push({
            size,
            quantity: parseInt(quantityAction),
          });
        }
      } else {
        if (parseInt(quantityAction) > 1) {
        } else {
          existingProduct.variants.push({
            color: colorId,
            images: [imageCart],
            variantColor: [{ size, quantity }],
          });
        }
      }
    }

    // Check version before saving
    const currentCart = await CartItem.findById(userOri.cart);
    if (cartUser.__v !== currentCart.__v) {
      res.status(409).json({ error: "Version Conflict" });
      return;
    }

    await cartUser.save();
    res.json(userByCart.cart);
  } catch (err) {
    console.error(err, "222");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const checkStock = async (req, res, next) => {
  try{
    const { colorId, productId, size, quantity } = req.query;
    const s = size.slice(0, 3).trim()
    console.log('sssss'+s)
    const u = await User.findOne({_id:req.body.user_id || '64d600df4aa3bbbf4a81e6d2'})
    const cart = await CartItem.findOne({_id:u.cart.toString()})
    const pct = cart.productItem.find(p=>p.productId.toString()===productId)
    const vct = pct.variants.find(v=>v.color.toString()===colorId)
    let quantityAll=0
    const vcct = vct.variantColor.forEach(vc=>{
      vc.size===s,
      quantityAll+=parseInt(vc.quantity)
    })      
    const pData = await Product.findOne({_id: productId}).lean()
    const variant = await pData.variants.find(v=>v.color.toString()===colorId)
    const vco = await variant.variantColor.find(vc => vc.size = s);
    const quantityInStore = vco.quantity
    let checkStockResult
    if(quantityInStore<quantityAll){
      checkStockResult = 'Sản phẩm trong kho còn ít hơn nhu cầu của bạn, vui lòng thay đổi!'
    } else{
      checkStockResult =""
    }
    res.json(checkStockResult)
  }catch(err){
    console.log(err);
  }
}

module.exports = {
  getProductCart,
  addOrPutProductToCart,checkStock
};
