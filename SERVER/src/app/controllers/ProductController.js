const saveProduct = async (req, res) => {
  const formData = req.body
  const title = req.body.formData
 console.log(title)
}
const saveProduct2 = async (req, res) => {
    try {
      const { title, price, description, typeName, subTypeName, collectionName } = req.body;
      const author = req.session.user_id;
      const imagePaths = req.files.map((file) => file.filename);
      const variantsData = req.body.colorName;
      const variants = createVariantsFromData(req, variantsData, req.files, imagePaths, typeName);
      const images = req.files.map((file) => file.filename);
      const product = createProduct(title, price, description, author, images, variants);
      await product.save();
      const type = await findOrCreateType(typeName);
      await findOrCreateSubType(type, subTypeName, product);
      if(collectionName){
        await findOrCreateCollection(collectionName, product) 
      }
      console.log('Product and variants saved to MongoDB');
      res.sendStatus(200);
    } catch (error) {
      console.error('Error saving product and variants:', error);
      res.sendStatus(500);
    }
  };
  const createVariantsFromData = (req, variantsData, files, imagePaths, typeName) => {
    let imagePathsCopy = imagePaths
    let a = 0;
    const variants = variantsData.map((color, index) => {
      console.log(imagePaths);
      let fieldName;
      let numFilesUploaded;
      let nextA = a; // Biến để lưu giá trị của a qua các lần lặp tiếp theo
      for (; nextA <= 100; nextA++) {
        fieldName = `variantImages-${nextA}[]`;
        numFilesUploaded = files.filter((file) => file.fieldname === fieldName).length;
        console.log(numFilesUploaded);
        console.log('a=' + nextA);
        if (numFilesUploaded !== 0) {
          a = nextA + 1; // Cập nhật giá trị của a cho lần lặp tiếp theo
          break; // Thoát khỏi vòng lặp for khi tìm thấy điều kiện thỏa mãn
        } else {
          // Xử lý nếu không tìm thấy file upload
        }
      }
      const variant = {
        color,
        images: imagePathsCopy.slice(0, numFilesUploaded),
        variantColor: []
      };
      imagePathsCopy = imagePathsCopy.slice(numFilesUploaded)
  
      if (typeName === 'Phụ kiện') {
        variant.variantColor.push({
          size: 'FreeSize',
          quantity: parseInt(req.body[`variantFreeSize`][index]),
        });
      } else {
        const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        for (const size of sizes) {
          variant.variantColor.push({
            size,
            quantity: parseInt(req.body[`variantSize${size}`][index]),
          });
        }
      }
      return variant;
    });
  
    return variants;
  };
  
  
  
  
  
  
  const createProduct = (title, price, description, author, images, variants) => {
    return new Product({
      title,
      price,
      description,
      author,
      images,
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
    let subType = await Subtype.findOne({ subTypeName,_id: { $in: type.subtypes } });
  if (!subType) {
      subType = new Subtype({
          subTypeName,
          products: [product._id], 
      }); 
      await subType.save(); 
      type.subtypes.push(subType._id); 
      await type.save()
  } else {
    subType.products.push(product._id)
    await subType.save(); 
  }
    return subType;
  };
  const findOrCreateCollection = async (subTypeName, product) => {
  
    const collection = await Type.findOne({ _id:'64c4c7f4e2a184d32cff6540'});
    let subType = await Subtype.findOne({ subTypeName, _id: { $in: collection.subtypes } });
  if (!subType) {
      subType = new Subtype({
          subTypeName,
          products: [product._id], 
      }); 
      await subType.save(); 
      collection.subtypes.push(subType._id); 
      await collection.save()
  } else {
    subType.products.push(product._id)
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
    saveProduct
}