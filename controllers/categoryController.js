const mongoose = require("mongoose");
const Category = require("../model/category");
const { CategoryErrorHandler } = require("../utils/errorHandler");

const addCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.send(category);
    } catch (error) {
        error = CategoryErrorHandler(error);
        res.status(500).send(error);
    }
}
const getCategory = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.send(categories);
    } catch (error) {
        res.status(500).send(error);
    }
}

const updateCategory = async (req, res) => {
    try {
        const isValidId = mongoose.isValidObjectId(req.params.id);
        if(!isValidId){
            return res.status(400).send({ error: "Please provide a valid category Id" });
        }
        if(!req.body.name){
            return res.status(400).send({ error: "Please provide category name" });
        }
        const category = await Category.findByIdAndUpdate(req.params.id, {$set: { name: req.body.name }}, { runValidators: true, new: true });
        res.status(200).send(category);
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

const deleteCategory = async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).send({ error: "Please provide a valid category Id" });
        }
        await Category.findByIdAndDelete(req.params.id);
        res.status.send({ message: "Category has been deleted" });
    } catch (error) {
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = {
    addCategory,
    getCategory,
    updateCategory,
    deleteCategory
}