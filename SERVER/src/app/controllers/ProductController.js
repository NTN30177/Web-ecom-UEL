const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");
const { Feedback } = require("../models/feedback");

const getProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const softDeleteProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.is_deleted = true;

    await product.save();

    return res.status(200).json({ message: "Soft delete successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const toggleSoftDeleted = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    product.is_deleted = !product.is_deleted;
    await product.save();
    res.json({ message: "Soft delete toggled successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const saveProduct = async (req, res) => {
  try {
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
    const author = "65928d92a510883c26c900be";
    const receivedFiles = req.files;
    const imageList = convertFilesToDesiredFormat(receivedFiles);
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
      console.log('.......................')
    const type = await findOrCreateType(typeName);
    await findOrCreateSubType(type, subTypeName, product);
    if (collectionName) {
      await findOrCreateCollection(collectionName, product);
    }
    res.sendStatus(200);
  } catch (error) {
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
  const variantsString = req.body;
  const variants = variantsString.variant.map((v, index) => {
    // const colorFake = "64cb721d066ac7727d33ceda";
    accessoryId = "64c4c7621539b1bd9c0fae5b";
    if (typeName === "Phụ kiện") {
      console.log('pk')
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

const convertStringToNumbers = (string) => {
  let valueNumber = string.replace(/[^\d]/g, "");
  return parseInt(valueNumber);
};

const createProduct = (
  title,
  sku,
  price,
  cost,
  description,
  author,
  variants
) => {
  console.log('././././././././')
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

const addFeedback = async (req, res) => {
  try {
    const { content_fb, images } = req.body;
    const { productId, orderId, userId } = req.query;

    console.log(content_fb, images, productId, orderId);

    const feedback = new Feedback({
      idUser: userId,
      idOrder: orderId,
      content: content_fb,
      images: images,
    });

    console.log(req.session.user_id);
    await feedback.save();

    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $push: { feedbackList: feedback._id } },
      { new: true }
    );

    res.status(200).json({ message: "Feedback added successfully", feedback });
    console.log("Feedback submitted successfully");
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.sendStatus(500);
  }
};
const getProductDetail = async (req, res) => {
  try {
    const slug = req.params.slug;
    console.log(slug);
    const data = await Product.findOne({ slug }).populate({
      path: "variants.color",
      select: "imageColor nameColor",
    });
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  saveProduct,
  getProduct,
  toggleSoftDeleted,
  softDeleteProduct,
  addFeedback,
  getProductDetail,
};
