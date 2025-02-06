const express = require("express");
const { getAllProducts, getStatistics, getBarChartData } = require("../controllers/productController");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/statistics", getStatistics);
router.get("/bar-chart",getBarChartData);

module.exports = router;
