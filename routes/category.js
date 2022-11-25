const route = require("express").Router();
const { addCategory, getCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");



route.get("/", getCategory);
route.post("/", addCategory);
route.patch("/:id", updateCategory);
route.delete("/:id", deleteCategory);



module.exports = route;