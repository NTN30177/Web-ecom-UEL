const {
  Product,
  Type,
  Subtype,
  Color,
  CartItem,
} = require("../models/product");

const saveProduct2 = async (req, res) => {
  const { variant } = req.body;

  const sizeXXLValue = variant[0].sizeXXL;
  console.log("123");
  console.log(sizeXXLValue);
};

const saveProduct = async (req, res) => {
  try {
    const {
      productName,
      productSku,
      price,
      description,
      typeName,
      subTypeName,
      collectionName,
    } = req.body;
    const author = "64ca103baeac1741e179f4c7";
    // const author = req.session.user_id||'64ca103baeac1741e179f4c7';
    const receivedFiles = req.files;
    const imageList =  convertFilesToDesiredFormat(receivedFiles);
    console.log(imageList);
    const variants = await createVariantsFromData(req, typeName, imageList);
    const product = createProduct(
      productName,
      productSku,
      price,
      description,
      author,
      variants
    );
    await product.save();
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
  console.log(variantsString,'5555')
  const variants = variantsString.variant.map((v, index) => {
    const colorFake = "64cb721d066ac7727d33ceda";
    const variant = {
      color: colorFake,
      images: imageList[index],
      variantColor: [],
    };
    if (typeName === "Phụ kiện") {
      variant.variantColor.push({
        size: "FreeSize",
        quantity: parseInt(req.body.variant[index].freeSize),
      });
    } else {
      const sizes = ["S", "M", "L", "XL", "XXL"];
      for (const size of sizes) {
        const sizePropertyName = `size${size}`;
        variant.variantColor.push({
          size,
          quantity: parseInt(req.body.variant[index][sizePropertyName]),
        });
      }
    }

    return variant;
  });

  return variants;
};

const createProduct = (title, sku, price, description, author, variants) => {
  return new Product({
    title,
    sku,
    price,
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

module.exports = {
  saveProduct,
};
