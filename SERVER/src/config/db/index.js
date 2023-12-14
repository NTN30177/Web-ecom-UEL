const mongoose = require('mongoose')
async function connect(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/example_test', {

        });
        console.log('Connect successful');
    } catch (error) {
        console.log('cf');
    }
}
module.exports = { connect };
