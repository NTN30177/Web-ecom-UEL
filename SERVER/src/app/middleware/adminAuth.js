const User = require('../models/user');

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            res.redirect('/admin/home');
        }
        next();
    } catch (err) {
        console.error(err.message);
    }
};
const isAdmin = async (req, res, next) => {
    try {
        const userData = await User.findOne({
            _id: req.session.user_id,
        }).lean();
        if (userData.is_admin === 0) {
            res.redirect('/error');
        } else {
            req.session.user_id = userData._id;
            next();
        }
    } catch (err) {
        console.error(err.message);
    }
};

const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
        } else {
            res.redirect('../admin');
        }
        next();
    } catch (err) {
        console.log(err.message);
    }
};

module.exports = {
    isLogout,
    isLogin,
    isAdmin,
};
