// campaignModel.js
const mongoose = require('mongoose');



const campaignSchema = new mongoose.Schema({
    campaignName: String,
    discountPercentage: Number,
    startTime: Date, // Sử dụng kiểu dữ liệu Date
    endTime: Date,   // Sử dụng kiểu dữ liệu Date
    campaignImage: [String],
    outofSale:[],
    quantity:Number,
    campaignProduct: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantityHasPurchase: {
            type: Number,
            default: 0,
        }
    }]
    

});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = {Campaign};
