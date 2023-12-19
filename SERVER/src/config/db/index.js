const mongoose = require('mongoose')
async function connect(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/WEB_ECOM', {

        });
        console.log('Connect successful');
    } catch (error) {
        console.log('cf');
    }
}
module.exports = { connect };
