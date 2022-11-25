const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minLength: 3,
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    detailedDescription: {
        type: String,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        validate: function(val){
            if(val < 0){
                throw new Error("Please provide a valid quantity");
            }
        }
    },
    inStock: {
        type: Boolean,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    oldPrice: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    productNumber: {
        type: String,
        required: true,
    },
    color: {
        type: String
    },
    mainImage: {
        type: Buffer
    } ,
    images: [{
        type: Buffer
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;