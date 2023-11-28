const mongoose = require("mongoose");
const category = require("./category");
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
// productSchema.pre("save", async function (next) {
//   // Get the category document
//   const category = await category.findById(this.category);
//   // If the category has a parent, set the variant to the category name
//   if (category.parent) {
//     this.variant = category.name;
//   } else {
//     // Otherwise, set the variant to "single product"
//     this.variant = "single product";
//   }
//   // Call next to proceed with the save operation
//   next();
// });

module.exports = mongoose.model("Product", productSchema);
