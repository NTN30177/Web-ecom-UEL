const express = require('express')
const router = express.Router();
const productController = require('../app/controllers/ProductController');
// const upload = multer({ storage: storage });

router.post(
    '/add-product',
    // upload.single('image'),
    productController.saveProduct,
);
module.exports = router;
