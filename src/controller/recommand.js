const { getCategoriesById } = require("./category");
const { getProductsBySlug } = require("./product");

exports.getRecommendProducts = async (req, res) => {
  const { categoryId } = req.query;
  console.log("categoryId: ", categoryId);
  const parentCategory = await getCategoriesById(categoryId);

  console.log("childCategories: ", parentCategory);
  //   const recommendedProducts = [];
  //   for (const childCategory of parentCategory) {
  //     const products = await getProductsBySlug(childCategory.id);
  //     recommendedProducts.push(...products.slice(0, 1)); // Choose at least one product
  //   }

  //   res.json(recommendedProducts);
};
