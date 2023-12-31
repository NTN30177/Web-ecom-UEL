const { Product, Type, Subtype, Color, CartItem } = require("../models/product");
const { Province, District, Ward } = require("../models/address");

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
  const getColor2 = async(req, res, next) => {
    try{
      const colorData = await Color.find({}).lean()
      console.log(colorData)
      res.json(colorData)
    }catch(err){
      console.error(err);
    }
  }


const getType = async (req, res, next) => {
  try {
    const type = await Type.find({ _id: { $ne: '64c4c7f4e2a184d32cff6540' } });
    res.json(type);
  } catch (err) {
    console.error(err.message);
  }
};

const getSubType = async (req, res, next) => {
  try {
    const typeName = req.params.id;
    console.log(typeName)
    const typePopulateSubType = await Type.findOne({typeName})
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

    // console.log(typePopulateSubType)
    res.json(typePopulateSubType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi máy chủ." });
  }
};

const getProvince = async (req, res, next) => {
  try {
    const province = await Province.find({}).lean();
    console.log(province)
    res.json(province);
  } catch (err) {
    console.log(err);
  }
};
const getDistrict = async (req, res) => {
  try { 
    const id = req.params.provinceId;
    const data = await District.find({ parent_code: id }).lean();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};
const getWard = async (req, res) => {
  try { 
    const id = req.params.districtId;
    const data = await Ward.find({ parent_code: id }).lean();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};





module.exports = {
    getColor, getType, getSubType,collection, getProvince, getDistrict, getWard, getColor2
  };
  