const Product = require("../model/product");
const { ProductErrorHandler } = require("../utils/errorHandler");


const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.status(200).send(products);
}
const getProductById = async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id });
    res.status(200).send(product);
}



const addProducts = async (req, res) => {
    try {
        const product = new Product({ ...req.body, owner: req.user._id });
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        error = ProductErrorHandler(error);
        res.status(error.status).send(error);
    }
}

const getCurrentUserProducts = async (req, res) => {
    const products = await Product.find({ owner: req.user._id });
    res.status(200).send(products);
}

const updateProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, owner: req.user._id });
        if(!product){
            return res.status(400).send({ message: "You can't update this product" });
        }
        Object.keys(req.body).forEach(key => {
            product[key] = req.body[key];
        });
        await product.save();
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ error: { message: "Internal Server Error OR Please check you connection" }});
    }
}

// Decrease Quantity when purchased
const decreaseProductQuantity = async (req, res) => {
    try {
        // const product = await Product.findByIdAndUpdate(req.params.id, { $set: { quantity: (quantity - req.body.quantity) }}, { new: true });
        const product = await Product.findOne({ _id: req.params.id });
        if((product.quantity - req.body.quantity < 0)){
            return res.status(400).send({ error: { message: "Out Of Stock" } });
        }
        product.quantity = product.quantity - req.body.quantity;
        await product.save();
        return res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ error: { message: "Server error or Please check your connection" }});
    }

}

// Increase Quantity by Product Owner
const increaseProductQuantity = async (req, res) => {
    try {
        // const product = await Product.findByIdAndUpdate(req.params.id, { $set: { quantity: (quantity + req.body.quantity) }}, { new: true });
        const product = await Product.findOne({ _id: req.params.id, owner: req.user._id });
        if(req.body.quantity < 0){
            return res.status(400).send({ error: { message: "Please provide a valid quantity" } });
        }
        product.quantity = product.quantity + req.body.quantity;
        await product.save();
        return res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ error: { message: "Server error or Please check your connection" }});
    }

}



// Count Total Product for Admin
const getProductsCount = async (req, res) => {
    const count = await Product.find().count();
    res.status(200).send({ TotalProduct: count });
}



module.exports = {
    getProducts,
    addProducts,
    getCurrentUserProducts,
    getProductsCount,
    getProductById,
    updateProductById,
    decreaseProductQuantity,
    increaseProductQuantity,
}