const mongoose = require("mongoose");
const Order = require("../model/order");
const OrderItem = require("../model/orderItem");
const { OrderErrorHandler } = require("../utils/errorHandler");



const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", ["name", "email"]).populate({
            path: "orderItems",
            populate: {
                path: "product",
                populate: [
                    "category",
                    "owner"
                ]
            }
        });
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send(error)
    }
}

// Order by ID
const getOrderById = async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(404).send({ error: { message: "Invalid Order Id" }});
        }
        const order = await Order.findOne({ _id: req.params.id });
        if(!order){
            return res.status(404).send({ error: { message: "No Order Found with the given Id" }});
        }
        res.status(200).send(order);
    } catch (error) {
        res.status(500).send(error)
    }
}

const getAllOrdersOfCurrentUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send(error)
    }
}


const createNewOrder = async (req, res) => {
    try {
        const orderItemIds = await Promise.all(req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });
            await newOrderItem.save();
            return newOrderItem._id
        }));
    
        const totalPriceList = await Promise.all(orderItemIds.map(async (id) => {
            const orderItem = await OrderItem.findById(id).populate("product", 'price');
            const eachItemsTotalPrice = orderItem.product.price * orderItem.quantity;
            return eachItemsTotalPrice;
        }));
    
        const totalPrice = totalPriceList.reduce((a, b)=> a + b, 0);
    
        const newOrder = new Order({
            orderItems: orderItemIds,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zipCode: req.body.zipCode,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.user._id,
            orderDate: req.body.orderDate
        });
    
        await newOrder.save();
        res.send(newOrder);
    } catch (error) {
        error = OrderErrorHandler(error);
        res.status(error.status).send(error);
    }
}


// Delete/cancel order by user
const cancelOrderOfCurrentUser = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if(!order) return res.status(404).send({ error: { message: "Order not found" }});
        if(order.status === "Pending" || order.status === "Shipped"){
            // await Promise.all(order.orderItems.map(async (id) => await OrderItem.findByIdAndRemove(id)));
            // await order.remove();
            order.status = "Cancel";
            await order.save();
            return res.status(200).send(order);
        }
        res.status(400).send({ error: { message: "Order can't cancel at this time" }});
    } catch (error) {
        res.status(500).send({ error });
    }
}

// Change ORDER status by Admin
const changeOrderStatus = async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).send({ error: { message: "Order with given Id was not found" }});
        const order = await Order.findByIdAndUpdate(req.params.id, { $set: { status: req.body.status }}, { new: true });
        if(!order){
            return res.status(404).send({ error: { message: "No order found" }});
        }
        res.status(200).send(order);
    } catch (error) {
        
    }
}

const countAllOrder = async (req, res) => {
    try {
        const count = await Order.countDocuments({});
        res.status(200).send({ "Total Orders": count })
    } catch (error) {
        res.status(500).send(error);
    }
}

const totalSalesOfAllOrder = async (req, res) => {
    try {
        const totalSales = await Order.aggregate([
            { 
                $group:  {
                    _id: null,
                    totalSales: { $sum: '$totalPrice' } 
                }
            }
        ]);
        if (!totalSales) {
            return res.status(400).send('The order sales cannot be generated')
        }
        res.status(200).send({ totalSales })
    } catch (error) {
        
    }
}


module.exports = {
    getAllOrders,
    getOrderById,
    createNewOrder,
    getAllOrdersOfCurrentUser,
    cancelOrderOfCurrentUser,
    changeOrderStatus,
    countAllOrder,
    totalSalesOfAllOrder,
}