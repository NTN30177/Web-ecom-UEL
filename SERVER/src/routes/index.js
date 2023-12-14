
const productRouter = require('./product');


function route(app) {

    app.use('/product', productRouter);
    app.use('/admin', productRouter);

}

module.exports = route;
