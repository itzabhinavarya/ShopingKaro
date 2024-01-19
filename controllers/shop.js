const { redirect } = require("react-router");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

exports.getProducts = (req, res, next) => {
  //   console.log(adminData.products);
  //   res.sendFile(path.join(rootDir, "views", "shop.html"));
  //   const products = adminData.products;

  // ---------- With MongoDB -------------
  // Product.fetchAll((products) => {
  //   res.render("shop/product-list", {
  //     prods: products,
  //     pageTitle: "All Products",
  //   });
  // });

  // ---------- With Mongoose -------------
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;

  // ---------- With MongoDB -------------
  // Product.getProductById(prodId).then((product) => {
  //   res.render("shop/product-details", {
  //     product: product,
  //     pageTitle: product.title,
  //   });
  // });

  // ---------- With Mongoose -------------
  Product.findById(prodId).then((product) => {
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

  // ---------- With MongoDB -------------
  // Product.fetchAll((products) => {
  //   res.render("shop/index", { prods: products, pageTitle: "Shop" });
  // });

  // ---------- With Mongoose -------------
  Product.find().then((products) => {
    res.render("shop/index", { prods: products, pageTitle: "Shop" });
  });
};

// exports.addToCart = (req, res, next) => {
//   res.render("shop/cart", { pageTitle: "your Cart" });
// };

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  // ---------- With MongoDB -------------
  // Product.getProductById(prodId)
  //   .then((product) => {
  //     return req.user.addToCart(product);
  //   })
  //   .then((result) => {
  //     console.log(result);
  //     res.redirect("/cart");
  //   });

  // ----------------------Not this one-----------------
  // Product.getProductById(prodId, (product) => {
  //   Cart.addproduct(prodId, product.price);
  // });
  // console.log(prodId);

  // ---------- With Mongoose -------------
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    });
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
    // .getCart()
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
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
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((x) => {
        return { quantity: x.quantity, product: { ...x.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      order.save();
    })
    .then((result) => {
      return req.user.clearCart();
      // res.render("shop/checkout", { pageTitle: "Checkout" });
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  
  // --------------- By Using MongoDB -------------
  // req.user
  //   .getOrders()
  //   .then((orders) => {
  //     res.render("shop/orders", { pageTitle: "My Orders", orders: orders });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });


    // --------------- By Using Mongoose -------------
    Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", { pageTitle: "My Orders", orders: orders });
    })
    .catch((err) => {
      console.log(err);
    });

};
