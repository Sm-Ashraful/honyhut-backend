const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order"); // Assuming you have your Order model defined in a separate file

// POST route to create a new order
exports.createOrderForCars = async (req, res) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      products,
      totalAmount,
      orderDate,
    } = req.body;

    // Check if customerDetails are present in the request
    const customerDetails = req.body.customerDetails
      ? req.body.customerDetails
      : null;

    // Create the order
    const order = new Order({
      customerDetails,
      shippingAddress,
      billingAddress,
      products,
      totalAmount,
      orderDate,
    });

    // Save the order to the database
    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
