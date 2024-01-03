exports.pageNotFound = (req, res, next) => {
  // res.status(404).sendFile(path.join(rootDir, "views", "NotFound.html"));
  res.status(404).render("404", { pageTitle: "Not Found", path: "/404" });
};
