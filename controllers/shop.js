const { redirect } = require("react-router");
const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  //   console.log(adminData.products);
  //   res.sendFile(path.join(rootDir, "views", "shop.html"));
  //   const products = adminData.products;
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
    });
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.getProductById(prodId).then((product) => {
    res.render("shop/product-details", {
      product: product,
      pageTitle: product.title,
    });
  });
};

exports.getIndex = (req, res, next) => {
  // Product.fetchAll((products) => {
  //   res.render("shop/index", { prods: products, pageTitle: "Shop" });
  // });

  Product.fetchAll((products) => {
    res.render("shop/index", { prods: products, pageTitle: "Shop" });
  });
};

// exports.addToCart = (req, res, next) => {
//   res.render("shop/cart", { pageTitle: "your Cart" });
// };

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.getProductById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
  // Product.getProductById(prodId, (product) => {
  //   Cart.addproduct(prodId, product.price);
  // });
  // console.log(prodId);
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        pageTitle: "My Cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      // res.render("shop/checkout", { pageTitle: "Checkout" });
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", { pageTitle: "My Orders", orders: orders });
    })
    .catch((err) => {
      console.log(err);
    });
};
