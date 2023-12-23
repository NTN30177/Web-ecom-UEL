const express = require("express");
const cors = require("cors");
const router = express.Router();
const productController = require("../app/controllers/ProductController");
const multer = require("multer");
const path = require("path");

function convertFileName(fileName) {
  const fileNameWithoutExtension = path.basename(
    fileName,
    path.extname(fileName)
  );
  const fileNameWithoutDiacritics = fileNameWithoutExtension
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const sanitizedFileName = fileNameWithoutDiacritics
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
  return sanitizedFileName;
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/productImages"));
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const fileNameWithoutExtension = path.basename(
      file.originalname,
      fileExtension
    );

    // Chuyển đổi tên tệp tiếng Việt có dấu thành không dấu và chỉ giữ lại dấu cách
    const sanitizedFileName = convertFileName(fileNameWithoutExtension);
    const name = Date.now() + "-" + sanitizedFileName + fileExtension;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/add-product",
  upload.any(),
  productController.saveProduct
);




module.exports = router;
