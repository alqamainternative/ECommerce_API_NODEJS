const route = require("express").Router();
const auth = require("../utils/auth");
const authAdmin = require("../utils/authAdmin");

const { 
    createNewOrder, getAllOrders, getAllOrdersOfCurrentUser, 
    cancelOrderOfCurrentUser, changeOrderStatus, countAllOrder,
    totalSalesOfAllOrder,
 } = require("../controllers/orderController");


//  GET all ORDER for admin
route.get("/", auth, authAdmin, getAllOrders);

// Orders of current user
route.get("/me", auth, getAllOrdersOfCurrentUser);

// Generate new ORDER
route.post("/", auth, createNewOrder);

// CANCEL Order of current user by ID
route.get("/me/cancel/:id", auth, cancelOrderOfCurrentUser);

// CHANGE Order Status by ID (ADMIN)
route.post("/change-status/:id", auth, authAdmin, changeOrderStatus);

// COUNT no of Order (ADMIN)
route.get("/count-orders", auth, authAdmin, countAllOrder);

// Total Sales of Order (ADMIN)
route.get("/totalsales", auth, authAdmin, totalSalesOfAllOrder);

module.exports = route;