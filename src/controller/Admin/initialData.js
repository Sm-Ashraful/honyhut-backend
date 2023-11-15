const Category = require("../../models/category");
const Product = require("../../models/product");

function createCategories(categories, parentId = null) {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
}

exports.initialData = async (req, res) => {
  // if you need to specific user products it would by this
  //  const products = await Product.find({ createdBy: req.user._id })
  try {
    const categories = await Category.find({}).exec();
    // Use Mongoose's aggregate framework to group products by category
    const result = await Product.aggregate([
      {
        $lookup: {
          from: "categories", // Assuming your category collection is named 'categories'
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $group: {
          _id: "$category",
          categoryInfo: { $first: "$categoryInfo" }, // Preserve the category information
          products: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: "$_id",
          category: "$categoryInfo.name", // Extract the category name
          products: 1,
        },
      },
    ]);

    res.status(200).json({
      categories: createCategories(categories),
      products: result,
      // orders,
    });
    // The result is an array where each element represents a category and its products
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  // const products = await Product.find({})
  //   .select(
  //     "_id name price boxStyle productType unit quantity description offer productPictures details category"
  //   )
  //   .populate({ path: "category", select: "_id name" })
  //   .exec();
  //   createdBy: req.user._id

  // .populate({ path: "category", select: "_id name" })
  // .exec();
  //   const orders = await Order.find({})
  //     .populate("items.productId", "name")
  //     .exec();
};
