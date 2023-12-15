
const productRouter = require('./product');
const adminRouter = require('./admin');
const userRouter = require('./user');


function route(app) {

    app.use('/product', productRouter);
    app.use('/admin', adminRouter);
    app.use('/cart',  cartRouter);
    app.get('/error', function (req, res) {
        res.render('404');
    });
    app.use('',  userRouter);

}

module.exports = route;
