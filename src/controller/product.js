const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");

exports.createProduct = (req, res) => {
  // res.status(200).json({ file: req.files, body: req.body });
  const {
    name,
    price,
    description,
    boxStyle,
    details,
    unit,
    productType,
    category,
    quantity,
    offer,
  } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: process.env.API + "/public/" + file.filename };
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    boxStyle,
    productType,
    details,
    unit,
    productPictures,
    category,
    offer,
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
exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
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
      .catch((err) => res.status(400).json({ error }));
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};
