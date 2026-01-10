const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

router.get("/", controller.getProducts);
router.post("/", controller.createProduct);
router.delete("/:id", controller.deleteProduct);

module.exports = router;
