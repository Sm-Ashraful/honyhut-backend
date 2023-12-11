const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
  const obj = JSON.parse(JSON.stringify(req.body));
  const { name, productId, price, description, details, category } = obj;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: process.env.API + "/public/" + file.filename };
    });
  }

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
  console.log("This is called", req.body);
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
  const { slug } = req.params;
  console.log("Slug: ", slug);
  Category.findOne({ slug: slug })
    .select("_id")
    .exec()
    .then((category) => {
      if (category) {
        Product.find({ category: category._id })
          .exec()
          .then((products) => {
            if (category.type) {
              if (products.length > 0) {
                res.status(200).json({
                  products,
                  priceRange: {
                    under5k: 5000,
                    under10k: 10000,
                    under15k: 15000,
                    under20k: 20000,
                    under30k: 30000,
                  },
                  productsByPrice: {
                    under5k: products.filter(
                      (product) => product.price <= 5000
                    ),
                    under10k: products.filter(
                      (product) =>
                        product.price > 5000 && product.price <= 10000
                    ),
                    under15k: products.filter(
                      (product) =>
                        product.price > 10000 && product.price <= 15000
                    ),
                    under20k: products.filter(
                      (product) =>
                        product.price > 15000 && product.price <= 20000
                    ),
                    under30k: products.filter(
                      (product) =>
                        product.price > 20000 && product.price <= 30000
                    ),
                  },
                });
              }
            } else {
              res.status(200).json({ products });
            }
          })
          .catch((error) => {
            if (error) {
              return res.status(400).json({ error });
            }
          });
      }
    })
    .catch((error) => {
      if (error) {
        return res.status(400).json({ error });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;

  if (productId) {
    Product.findOne({ _id: productId })
      .then((product) => res.status(200).json({ product }))
      .catch((err) => res.status(400).json({ err }));
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

//get product by product type
exports.getProductByType = (req, res) => {
  const { productType } = req.params;
  if (productType) {
    Product.find({
      productType: productType,
    })
      .then((products) => res.status(200).json({ products }))
      .catch((err) => res.status(400).json({ err }));
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

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

//simple
exports.getCarAromaTherapyProduct = async (req, res) => {
  try {
    Product.find({ productType: "top" }).then((product) =>
      res.status(200).json({ product })
    );
  } catch (error) {
    res.status(400).json({ error: error, message: "Server Invalid!" });
  }
};
