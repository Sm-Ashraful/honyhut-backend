const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },

    productType: {
      type: String,
    },
    unit: {
      type: String,
    },
    quantity: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    offer: {
      type: Number,
    },
    productPictures: [
      {
        img: { type: String },
      },
    ],
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: String,
      },
    ],
    details: { type: String, require: true },
    variant: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ranking: {
      type: Number,
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
