const express = require("express");
const router = express.Router();
const colorController = require("../app/controllers/ApiController");

router.get("/color", colorController.getColor);
router.get("/type/", colorController.getType);
router.get("/subType/:id", colorController.getSubType);

module.exports = router;
