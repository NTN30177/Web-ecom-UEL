const mongoose = require('mongoose');

// const campaignSchema = new mongoose.Schema({
//     campaign_name: {
//         type: String,
//         required: true,
//     },
//     campaign_start: {
//         type: Date,
//         required: true,
//     },
//     campaign_end: {
//         type: Date,
//         required: true,
//     },
//     campaign_script: String,
//     product_quantity_campaign_method: {
//         type: String,
//         required: true,
//     },
//     product_quantity_campaign_value: {
//         type: Number,
//         required: true,
//     },
//     product_name: {
//         type: String,
//         required: true,
//     },
//     product_quantity_campaign: {
//         type: Number,
//         required: true,
//     },
// });


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

module.exports = { Campaign };
