const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const PageNotFound = require("./helper/NotFound");
const bodyParser = require("body-parser");
const path = require("path");
const mongoConnect = require("./helper/database").mongoConnect;

const app = express();
// app.set("view engine", "pug");
app.set("view engine", "ejs");
app.set("views", "views");

// const rootDir = require("./helper/path");
app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(PageNotFound);

mongoConnect(() => {
  app.listen(PORT, () => {
    console.log("App is running on the port http://localhost:3000");
  });
});

