const mongodb = require("mongodb");
const Product = require("../models/product");
const product = require("../models/product");

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add-Product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageURL = req.body.imageURL;
  const description = req.body.description;
  const price = req.body.price;

  // const product = new Product(title, price, description, imageURL,null,req.user._id);
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageURL: imageURL,
    userId: req.user,
  });

  product
    .save()
    .then(() => {
      console.log("Product Added Product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });

  // product.save();
  // res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const pId = req.params.prodId;
  Product.findById(pId).then((product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit-Product",
      editing: editMode,
      product: product,
    });
  });
  // res.redirect('/');
  // res.sendFile(path.join(rootDir, "views", "add-product.html"));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageURL = req.body.imageURL;
  const updatedDescription = req.body.description;
  const updatedPrice = req.body.price;

  // ------------------By Using MongoDB --------------------
  // const product = new Product(
  //   updatedTitle,
  //   updatedPrice,
  //   updatedDescription,
  //   updatedImageURL,
  //   new ObjectId(prodId)
  // );

  // product
  //   .save()
  //   .then((result) => {
  //     console.log("Product Updated Successfully...");
  //     res.redirect("/admin/products");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  // ------------------By Using Mongoose --------------------
  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageURL = updatedImageURL;
      return product.save();
    })
    .then((result) => {
      console.log("Product Updated Successfully...");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  Product.find()
    // .select("title price -_id")
    // .populate("userId", "name")
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
      });
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  // ------------------By Using MongoDB --------------------
  // Product.deleteById(prodId).then(() => {
  //   console.log("Product Deleted Successfully...");
  //   res.redirect("/admin/products");
  // });

  // ------------------By Using Mongoose --------------------
  Product.findByIdAndDelete(prodId).then(() => {
    console.log("Product Deleted Successfully...");
    res.redirect("/admin/products");
  });
};
