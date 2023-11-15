const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shippingAddress: {
    firstName: String,
    lastName: String,
    streetAddress: [],
    city: String,
    state: String,
    zip: String,
    phoneNumber: String,
    email: String,
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    streetAddress: [],
    city: String,
    state: String,
    zip: String,
    phoneNumber: String,
    email: String,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      quantity: Number,
    },
  ],
  totalAmount: Number,
  orderDate: Date,
});

module.exports = mongoose.model("Order", orderSchema);
