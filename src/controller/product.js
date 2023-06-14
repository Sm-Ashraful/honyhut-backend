const Product = require("../models/product");
const shortid = require("shortid");
const slugify = require("slugify");
const Category = require("../models/category");
const { ResultWithContext } = require("express-validator/src/chain");
const { response } = require("express");

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
    createdBy,
  } = req.body;
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
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
exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
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
