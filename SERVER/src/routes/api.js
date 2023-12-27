const express = require("express");
const router = express.Router();
const ApiController = require("../app/controllers/ApiController");
const sortFilterPaginationController = require("../app/controllers/SortFilterPaginationController");

router.get("/color", ApiController.getColor);
router.get("/type", ApiController.getType);
router.get("/subType/:id", ApiController.getSubType);
router.get("/province", ApiController.getProvince);
router.get("/district/:provinceId", ApiController.getDistrict);
router.get("/ward/:districtId", ApiController.getWard);
router.get(
    '/searchSortPagination/:slug',
    sortFilterPaginationController.getCategoryProductsPagination,
);
module.exports = router;
