const Category = require("../models/category");
const Product = require("../models/product");

const { getProductsBySlug } = require("./product");

// const getCategoriesById =(cate) => {
//   console.log("categoryId from getCategoriesById: ", req);
//   let categoryId = req.query.categoryId;

// };

exports.getRecommendProducts = async (req, res) => {
  const { categoryId } = req.query;
  console.log("Category req query: ", req.query);
  const category = await Category.findById(categoryId);
  try {
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const parentCategory = await Category.findOne({ _id: category.parentId });
    const allChildCategories = await Category.find({
      parentId: parentCategory._id,
    });
    const childCategoryIds = allChildCategories.map(
      (childCategory) => childCategory._id
    );
    const products = await Product.find({
      category: { $in: childCategoryIds },
    });
    const categoryProductCountMap = new Map();
    products.forEach((product) => {
      const categoryId = product.category;
      categoryProductCountMap.set(
        categoryId,
        (categoryProductCountMap.get(categoryId) || 0) + 1
      );
    });
    const recommendedProducts = products.filter((product) => {
      const productCategoryCount = categoryProductCountMap.get(
        product.category
      );
      return productCategoryCount >= 1;
    });
    res.status(200).json({ recommendedProducts });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
