const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
    {
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            // required: true
        },
        gender: {
            type: String
        },
        date_of_birth: {
            type: String
        },
        image: {
            type: String,
            default: 'user.png',
            // required: true
        },
        is_admin: {
            type: Number,
            required: true,
        },
        is_varified: {
            type: Number,
            default: 0,
        },
        token: {
            type: String,
            default: '',
        },
        historySearch: {
            type: Array,
        },
        // specific_address: {
        //     type: String,
        // },
        // province: {
        //     type: String,
        //     default: '',
        // },
        // district: {
        //     type: String,
        //     default: '',
        // },
        // ward: {
        //     type: String,
        //     default: '',
        // },
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CartItem',
        },
        addresslist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User_address',
            },
        ]
    },
    {
        timestamps: true,
    }
);

const addressSchema = mongoose.Schema(
    {
        is_default: {
            type: Boolean,
        },
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            // required: true
        },
        specific_address: {
            type: String,
        },
        province: {
            type: String,
            default: '',
        },
        district: {
            type: String,
            default: '',
        },
        ward: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
)


module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('User_address', addressSchema);
