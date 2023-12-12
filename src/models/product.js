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
    productId: { type: String, required: true, unique: true },
    price: {
      type: Number,
    },

    description: {
      type: String,
      trim: true,
    },

    productPictures: [
      {
        url: {
          type: String,
        },
      },
    ],
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        review: String,
      },
    ],
    details: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
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
