const { Order } = require("../models/order");
const { User } = require("../models/user");
const { Ward, District, Province } = require("../models/address");
const { UserAddress } = require("../models/user");

const saveOrder = async (req, res, next) => {
  try {
    const requestData = {
      cartItems: req.body.cartItems,
      addressId: req.body.addressId,
      userId: req.body.userId,
    };

    // Tạo một mảng các order items từ dữ liệu trong cartItems
    const orderItems = requestData.cartItems.map((cartItem) => {
      return {
        product: cartItem.productId,
        variants: cartItem.variants.map((variant) => ({
          color: variant.color._id,
          images: variant.images,
          variantColor: variant.variantColor.map((variantColor) => ({
            size: variantColor.size,
            quantity: variantColor.quantity,
          })),
        })),
      };
    });

    // Tạo đối tượng Order từ dữ liệu request
    const order = new Order({
      userId: requestData.userId,
      orderItems: orderItems,
      address: requestData.addressId,
      status: "Đang xử lý", // Giả sử mặc định là "Đang xử lý"
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
    console.log(savedOrder._id);
    res.json({ orderId: savedOrder._id, Message: "Mua hàng thành công!" });

    // Hàm tính tổng giá trị đơn hàng (bao gồm cả trường quantity)
    function calculateTotalPrice(orderItems) {
      return orderItems.reduce((total, orderItem) => {
        return (
          total +
          orderItem.variants.reduce((itemTotal, variant) => {
            return (
              itemTotal +
              variant.variantColor.reduce((variantTotal, variantColor) => {
                const productPrice = orderItem.product.price || 0;
                return variantTotal + variantColor.quantity * productPrice;
              }, 0)
            );
          }, 0)
        );
      }, 0);
    }

    // Hàm tính tổng số lượng của các sản phẩm trong đơn hàng
    function calculateTotalQuantity(orderItems) {
      return orderItems.reduce((totalQuantity, orderItem) => {
        return (
          totalQuantity +
          orderItem.variants.reduce((itemTotal, variant) => {
            return (
              itemTotal +
              variant.variantColor.reduce((variantTotal, variantColor) => {
                return variantTotal + variantColor.quantity;
              }, 0)
            );
          }, 0)
        );
      }, 0);
    }
  } catch (err) {
    console.log(err);
    // Xử lý lỗi tại đây nếu cần
  }
};

const orderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(orderId, '5555')
    const dataOrderDetail = await Order.find({ _id: orderId })
      .populate({
        path: "address",
      })
      .populate({
        path: "userId",
      })
      .populate({
        path: "orderItems.product",
        populate: {
          path: "variants.color",
          model: "Color",
          select: "nameColor imageColor",
        },
      })
      .populate({
        path: "orderItems.variants.color",
        model: "Color",
        select: "nameColor imageColor",
      });
    console.log(dataOrderDetail, '222222')
    const addressUser = await UserAddress.findOne({ _id: dataOrderDetail[0].userId.addressList[0] })
    const wardDetailAccount = await Ward.findOne({ code: addressUser.ward })
    const districtAccount = await District.findOne({ code: wardDetailAccount.parent_code })
    const provinceAccount = await Province.findOne({ code: districtAccount.parent_code })

    const wardDetail = await Ward.findOne({ code: dataOrderDetail[0].address.ward })
    const district = await District.findOne({ code: wardDetail.parent_code })
    const province = await Province.findOne({ code: district.parent_code })
    const dataAddressDetail = {
      wardDetail: wardDetail.path_with_type,
      ward: wardDetail.name_with_type,
      district: district.name_with_type,
      province: province.name_with_type,

      wardDetailAccount: wardDetailAccount.path_with_type,
      wardAccount: wardDetailAccount.name_with_type,
      districtAccount: districtAccount.name_with_type,
      provinceAccount: provinceAccount.name_with_type,
    }
    console.log(dataOrderDetail, addressUser)
    res.json({ dataOrderDetail, dataAddressDetail });
  } catch (e) {
    console.log(e);
  }
};


const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: 'userId',
      select: 'first_name last_name',
    });

    const modifiedOrders = orders.map(order => {
      const { userId: { first_name, last_name }, ...rest } = order.toObject();
      return { first_name, last_name, ...rest };
    });
    // console.log("order with user name:", modifiedOrders)
    res.json(modifiedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




module.exports = {
  saveOrder,
  orderDetail,
  getOrders
};
