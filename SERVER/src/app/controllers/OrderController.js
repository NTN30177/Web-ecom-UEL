const { Order } = require("../models/order");
const { User } = require("../models/user");

const saveOrder = async (req, res, next) => {
  try {
    const requestData = {
      cartItems: req.body.cartItems,
      addressId: req.body.addressId,
      userId: req.body.userId,
    };

    // Tạo một mảng các order items từ dữ liệu trong cartItems
    const orderItems = requestData.cartItems.map(cartItem => {
      return {
        product: cartItem.productId,
        variants: cartItem.variants.map(variant => ({
          color: variant.color._id,
          images: variant.images,
          variantColor: variant.variantColor.map(variantColor => ({
            size: variantColor.size,
            quantity: variantColor.quantity,
          })),
        }))
      };
    });

    // Tạo đối tượng Order từ dữ liệu request
    const order = new Order({
      orderItems: orderItems,
      address: requestData.addressId,
      status: "Đang xử lý",  // Giả sử mặc định là "Đang xử lý"
      totalPrice: calculateTotalPrice(orderItems), // Tính tổng giá trị đơn hàng từ các orderItems
      totalQuantity: calculateTotalQuantity(orderItems), // Tính tổng số lượng từ các orderItems
    });

    // Lưu đối tượng Order vào cơ sở dữ liệu
    const savedOrder = await order.save();
    console.log("Đơn hàng đã được lưu:", savedOrder);
    await User.findByIdAndUpdate(
      requestData.userId,
      { $push: { orderList: savedOrder._id } },
      { new: true }
    );

    // Hàm tính tổng giá trị đơn hàng (bao gồm cả trường quantity)
    function calculateTotalPrice(orderItems) {
      return orderItems.reduce((total, orderItem) => {
        return total + orderItem.variants.reduce((itemTotal, variant) => {
          return itemTotal + variant.variantColor.reduce((variantTotal, variantColor) => {
            const productPrice = orderItem.product.price || 0;
            return variantTotal + (variantColor.quantity * productPrice);
          }, 0);
        }, 0);
      }, 0);
    }

    // Hàm tính tổng số lượng của các sản phẩm trong đơn hàng
    function calculateTotalQuantity(orderItems) {
      return orderItems.reduce((totalQuantity, orderItem) => {
        return totalQuantity + orderItem.variants.reduce((itemTotal, variant) => {
          return itemTotal + variant.variantColor.reduce((variantTotal, variantColor) => {
            return variantTotal + variantColor.quantity;
          }, 0);
        }, 0);
      }, 0);
    }
  } catch (err) {
    console.log(err);
    // Xử lý lỗi tại đây nếu cần
  }
};




  module.exports = {
    saveOrder

}