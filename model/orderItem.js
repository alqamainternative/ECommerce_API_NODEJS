const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        validate: function(val){
            if(val <= 0) throw new Error("Quantity must be greater than zero");
        }
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    }
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;