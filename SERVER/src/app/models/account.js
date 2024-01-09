const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema(
    {
        fullname: String,
        email: String,
        password: String,
        role: {
            type: String,
            default: '0',
        },
    },
    {
        timestamps: true,
    },
    {
        collection: 'accounts',
    },
);

const AccountModel = mongoose.model('accounts', accountSchema);
module.exports = AccountModel;
