const { Product, Type, Subtype, Color, CartItem } = require("../models/product");

const getColor = async (req, res, next) => {
    try {
      const colorData = await Color.find({}, { _id: 1, nameColor: 1 }).lean();
      const modifiedData = colorData.map(item => ({
        ...item,
        _id: item._id.toString()
      }));
      console.log(modifiedData);
      res.json(modifiedData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


const getType = async (req, res, next) => {
  try {
    const type = await Type.find({ _id: { $ne: '64c4c7f4e2a184d32cff6540' } });

    console.log(type)
    res.json(type);
  } catch (err) {
    console.error(err.message);
  }
};

const getSubType = async (req, res, next) => {
  try {
    const typeName = req.params.id;
    console.log(typeName)
    const typePopulateSubType = await Type.findOne({ _id: typeName })
      .populate("subtypes")
      .lean();

    console.log(typePopulateSubType.subtypes)
    res.json(typePopulateSubType.subtypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi máy chủ." });
  }
};
const collection = async (req, res, next) => {
  try {
    const typeName = req.params.type;
    console.log(typeName)
    const typePopulateSubType = await Type.findOne({ _id: '64c4c7f4e2a184d32cff6540' })
      .populate("subtypes")
      .lean();

    console.log(typePopulateSubType)
    res.json(typePopulateSubType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi máy chủ." });
  }
};
  module.exports = {
    getColor, getType, getSubType,collection
  };
  