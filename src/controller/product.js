const Product = require("../models/product");
const slugify = require("slugify");
const Category = require("../models/category");
const { APIFilters } = require("../../utils/APIFIlters.js");

const { uploadOnCloudinary } = require("../../utils/cloudinary.js");

exports.createProduct = async (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const { name, productId, price, description, details, category } = obj;
  let productPictures = [];

  ///
  if (req.files.length > 0) {
    productPictures = await Promise.all(
      req.files.map(async (file) => {
        try {
          const response = await uploadOnCloudinary(file.path);
          return { url: response.url };
        } catch (error) {
          // Handle upload error
          console.error(error);
          // ...
        }
      })
    );
  }
  console.log("Product Pictures: ", productPictures);

  const product = new Product({
    name: name,
    slug: slugify(name),
    productId,
    price,
    description,
    details,
    productPictures,
    category,
    createdBy: req.user._id,
  });

  product
    .save()
    .then((product) => {
      return res.status(201).json({ product });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
};
exports.getAllProduct = async (req, res) => {
  Product.find({})
    .then((products) => {
      res.status(200).json({ products });
    })
    .catch((error) => {
      res.status(400).json({ message: "Internal Server Error", error: error });
    });
};
//get all product id
exports.getProductIds = async (req, res) => {
  try {
    // Fetch all product IDs from the database
    const products = await Product.find({}, "_id"); // Assuming '_id' is the ID field in your Product model

    // Extract the product IDs from the array
    const productIds = products.map((product) => product._id);

    res.status(200).json({ productIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.getProductsBySlug = (req, res) => {
  const { id } = req;
  Category.findOne({ _id: id })
    .exec()
    .then((category) => {
      if (category) {
        Product.find({ category: category._id })
          .exec()
          .then((products) => {
            if (category.type) {
              if (products.length > 0) {
                return products;
              }
            } else {
              return products;
            }
          })
          .catch((error) => {
            if (error) {
              return error;
            }
          });
      }
    })
    .catch((error) => {
      if (error) {
        return error;
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { slug } = req.params;
  console.log("slug: ", slug);
  if (slug) {
    Product.findOne({ slug: slug })
      .then((product) => res.status(200).json({ product }))
      .catch((err) => res.status(400).json({ err }));
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

//get product by product type

//edit product by id
exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updateFields = req.body; // Include all fields that can be updated

    // Handle image updates
    if (req.files) {
      const newImages = req.files.map((file) => {
        return { img: process.env.API + "/public/" + file.filename };
      });
      updateFields.productPictures = [
        ...updateFields.productPictures,
        ...newImages,
      ];
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true }
    );

    res.status(201).json({ product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//filter product

exports.getProducts = async (req, res, next) => {
  const apiFilters = new APIFilters(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFilters.query;

  res.status(200).json({
    products,
  });
};
