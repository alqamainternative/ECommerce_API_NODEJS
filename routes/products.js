const route = require("express").Router();
const { 
    getProducts,
    addProducts,
    getCurrentUserProducts,
    getProductsCount,
    getProductById,
    updateProductById,
    decreaseProductQuantity,
    increaseProductQuantity,
} = require("../controllers/productController");
const auth = require("../utils/auth");
const authAdmin = require("../utils/authAdmin");


// Routes
route.get("/", getProducts);                             // All Products List
route.get("/:id", getProductById);                      // Products by id
route.post("/", auth, addProducts);                      // Add new Product
route.patch("/:id", auth, updateProductById);           // Update Products by id


// SHOW CURRENT USER PRODUCTS
route.get("/me", auth, getCurrentUserProducts);

// Decrease QUANTITY when someone purchased product; (req.body.quantity)
route.post("/:id/decrease-quantity", auth, decreaseProductQuantity);

// Increase QUANTITY by product owner; (req.body.quantity)
route.post("/:id/increase-quantity", auth, increaseProductQuantity);

// Admin
route.get("/product-count", auth, authAdmin, getProductsCount);



module.exports = route;