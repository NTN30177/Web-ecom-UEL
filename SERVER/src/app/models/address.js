const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug)



const provinceSchema = new mongoose.Schema({
    name: {
        type: String,
        // unique: true,
        trim: true,
        // required: true,
    },
    slug: { type: String, maxLength: 255, slug: 'title', unique: true },
    type: {
        type: String,
        trim: true,
    },
    name_with_type: {
        type: String,
    },
    code: {
        type: String,
    }
});

const districtSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    slug: { type: String, maxLength: 255, slug: 'title', unique: true },
    type: {
        type: String,
        trim: true,
    },
    name_with_type: {
        type: String,
    },
    path: {
        type: String,
    },
    path_with_type: {
        type: String,
    },
    code: {
        type: String,
    },
    parent_code: {
        type: String,
    }
});
const wardSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    slug: { type: String, maxLength: 255, slug: 'title', unique: true },
    type: {
        type: String,
        trim: true,
    },
    name_with_type: {
        type: String,
    },
    path: {
        type: String,
    },
    path_with_type: {
        type: String,
    },
    code: {
        type: String,
    },
    parent_code: {
        type: String,
    }
});



const Province = mongoose.model('Province', provinceSchema);
const District = mongoose.model('District', districtSchema);
const Ward = mongoose.model('Ward', wardSchema);




module.exports = {
    Province,
    District,
    Ward
};
