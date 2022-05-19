const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    cropId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop'
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity can not be less then 1.']
    },
    price: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const CartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [ItemSchema],
    subTotal: {
        default: 0,
        type: Number
    }
}, {
    timestamps: true
});

const OrderSchema = new Schema({
    crops: [ItemSchema],
    subTotal: {
        default: 0,
        type: Number
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    transaction_id: {},
    address: {
        type: String
    },
    status: {
        type: String,
        default: "Not Processed",
        enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"]
    },
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const Order = mongoose.model("Order", OrderSchema);
const Cart = mongoose.model("Cart", CartSchema);
module.exports = { Order, Cart };