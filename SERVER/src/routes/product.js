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
    cb(null, path.join(__dirname, "../public/userImages"));
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

//   console.log("Received form data:", req.body);

//   console.log("Received files:", req.files);

//   res.status(200).send("File uploaded successfully");
//   const receivedFiles = req.files;
//   const variantsString = JSON.stringify(req.body, (key, value) => {
//     if (value !== null && typeof value === 'object' && Object.getPrototypeOf(value) === null) {
//       // Omit the null prototype from the result
//       return Object.assign({}, value);
//     }
//     return value;
//   });

//     const variantsString2 = JSON.stringify(req.body);
  
//   console.log(variantsString2,'555');

//   const groupedFiles = convertFilesToDesiredFormat(receivedFiles);

//   console.log("Grouped Files:", groupedFiles);
// });



module.exports = router;
