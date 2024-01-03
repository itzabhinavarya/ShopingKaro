const express = require("express");
const shopController = require("../controllers/shop");
const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get('/products/:productId',shopController.getProduct)

router.get("/cart", shopController.addToCart);

router.post('/cart',shopController.postCart);

router.get("/checkout", shopController.checkout);

router.get('/order',shopController.getOrders);

module.exports = router;
