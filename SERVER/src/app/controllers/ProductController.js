const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem, 
} = require("../models/product");
const { Feedback } = require("../models/feedback");


// getProduct controller
const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
softDeleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    // Tìm sản phẩm trong cơ sở dữ liệu
    const product = await Product.findById(productId);

    // Kiểm tra nếu sản phẩm không tồn tại
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Cập nhật trạng thái is_deleted
    product.is_deleted = true;

    // Lưu sản phẩm đã cập nhật vào cơ sở dữ liệu
    await product.save();

    return res.status(200).json({ message: 'Soft delete successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


toggleSoftDeleted = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Toggle the is_deleted property
    product.is_deleted = !product.is_deleted;

    // Save the updated product
    await product.save();

    res.json({ message: 'Soft delete toggled successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const saveProduct2 = async (req, res) => {
  const { variant } = req.body;

  const sizeXXLValue = variant[0].sizeXXL;
  console.log("123");
  console.log(sizeXXLValue);
};

const saveProduct = async (req, res) => {
  try {
    console.log('route')
    const {
      productName,
      productSku,
      price,
      cost,
      description,
      typeName,
      subTypeName,
      collectionName,
    } = req.body;
    const author = "64ca103baeac1741e179f4c7";
    // const author = req.session.user_id||'64ca103baeac1741e179f4c7';
    const receivedFiles = req.files;
    const imageList = convertFilesToDesiredFormat(receivedFiles);
    console.log(imageList);
    const variants = await createVariantsFromData(req, typeName, imageList);
    const product = createProduct(
      productName,
      productSku,
      convertStringToNumbers(price),
      convertStringToNumbers(cost),
      description,
      author,
      variants
    );
    await product.save();
    console.log(product, 'p')

    const type = await findOrCreateType(typeName);
    await findOrCreateSubType(type, subTypeName, product);
    if (collectionName) {
      await findOrCreateCollection(collectionName, product);
    }
    console.log("Product and variants saved to MongoDB");
    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving product and variants:", error);
    res.sendStatus(500);
  }
};
const convertFilesToDesiredFormat = (receivedFiles) => {
  const groupedFiles = {};
  receivedFiles.forEach((file) => {
    const match = file.fieldname.match(/^(\d+)\[(\d+)\]$/);
    if (match) {
      const groupIndex = match[1];
      const itemIndex = match[2];
      if (!groupedFiles[groupIndex]) {
        groupedFiles[groupIndex] = [];
      }
      groupedFiles[groupIndex][itemIndex] = file.filename;
    }
  });
  const result = Object.values(groupedFiles).map((group) =>
    group.filter(Boolean)
  );
  return result;
};
const createVariantsFromData = (req, typeName, imageList) => {
  const variantsString = req.body
  console.log(variantsString, '5555')
  console.log(variantsString.variant, '5555')
  const variants = variantsString.variant.map((v, index) => {
    console.log(v.color, 'c5555')
    // const colorFake = "64cb721d066ac7727d33ceda";
    accessoryId='64c4c7621539b1bd9c0fae5b'
    if (typeName === 'Phụ kiện') {
      const variant = {
        color: v.colorFreeSize,
        images: imageList[index],
        variantColor: [],
      };
      variant.variantColor.push({
        size: "FreeSize",
        quantity: parseInt(req.body.variant[index].freeSize),
      });
    return variant;

      console.log(parseInt(req.body.variant[index].freeSize))
    } else {
      
      const variant = {
        color: v.color,
        images: imageList[index],
        variantColor: [],
      };
      const sizes = ["S", "M", "L", "XL", "XXL"];
      for (const size of sizes) {
        const sizePropertyName = `size${size}`;
        variant.variantColor.push({
          size,
          quantity: parseInt(req.body.variant[index][sizePropertyName]),
        });
      }
      return variant;
    }

  });

  return variants;
};

const convertStringToNumbers= (string) =>{
  let valueNumber = string.replace(/[^\d]/g, '');
  return parseInt(valueNumber);
}

const createProduct = (title, sku, price,cost, description, author, variants) => {
  return new Product({
    title,
    sku,
    price,
    cost,
    description,
    author,
    variants,


  });
};

const findOrCreateType = async (typeName) => {
  let type = await Type.findOne({ typeName });
  if (!type) {
    type = new Type({
      typeName,
      subtypes: [],
    });
    await type.save();
  }
  return type;
};

const findOrCreateSubType = async (type, subTypeName, product) => {
  let subType = await Subtype.findOne({
    subTypeName,
    _id: { $in: type.subtypes },
  });
  if (!subType) {
    subType = new Subtype({
      subTypeName,
      products: [product._id],
    });
    await subType.save();
    type.subtypes.push(subType._id);
    await type.save();
  } else {
    subType.products.push(product._id);
    await subType.save();
  }
  return subType;
};
const findOrCreateCollection = async (subTypeName, product) => {
  const collection = await Type.findOne({ _id: "64c4c7f4e2a184d32cff6540" });
  let subType = await Subtype.findOne({
    subTypeName,
    _id: { $in: collection.subtypes },
  });
  if (!subType) {
    subType = new Subtype({
      subTypeName,
      products: [product._id],
    });
    await subType.save();
    collection.subtypes.push(subType._id);
    await collection.save();
  } else {
    subType.products.push(product._id);
    await subType.save();
  }
  return subType;
};

const getSubtypesByType = async (req, res, next) => {
  try {
    // const { typeName } = req.body;
    const type = await Type.find({}).populate("subtypes");
    // const subtypeNames = type.subtypes.map(subtype => subtype.subTypeName);
    res.json(type);
  } catch (err) {
    console.error(err.message);
  }
};

const getTypeAndSubtypeData = async (req, res) => {
  try {
    // Truy vấn để lấy dữ liệu của type và subtype
    const typeData = await Type.find({}).populate("subtypes");

    // Lấy thông tin type và subtype từ typeData bằng map
    const resultArray = typeData.map((typeItem) => {
      return {
        typeName: typeItem.typeName,
        subtypes: typeItem.subtypes.map(
          (subtypeItem) => subtypeItem.subTypeName
        ),
      };
    });

    res.json(resutypePopulateSubtypeltArray);
  } catch (error) {
    console.error("Error getting type and subtype data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const submitFeedback = async (req, res) => {
  try {
    const { content } = req.body;
    const productId = '6587ea63026f8360883d3917'; // Default product ID
    const orderId = '6589c44703ad145b56e9e68d'; // Default order ID

    const feedback = new Feedback({
      idUser: req.session.user_id,
      idOrder: orderId,
      content: content,
    });

    await feedback.save();

    // Update the product with the feedback ID
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $push: { feedbackList: feedback._id } },
      { new: true }
    );

    // Add logic to handle the updated product
    console.log('Feedback submitted successfully');
    res.sendStatus(200);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.sendStatus(500);
  }
};


module.exports = {
  saveProduct, getProduct,toggleSoftDeleted, softDeleteProduct,
  submitFeedback
};
