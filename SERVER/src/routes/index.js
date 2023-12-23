
const productRouter = require('./product');
const adminRouter = require('./admin');
const userRouter = require('./user');
const cartRouter = require('./cart');
const apiRouter = require('./api');


function route(app) {


    app.use('/product', productRouter);
    app.use('/user', userRouter);
    app.use('/admin', adminRouter);
    app.use('/cart',  cartRouter);
    app.use('/api',  apiRouter);
    app.get('/error', function (req, res) {
        res.render('404');
    });


}

module.exports = route;
