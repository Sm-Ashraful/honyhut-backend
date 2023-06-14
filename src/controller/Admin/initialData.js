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
  const categories = await Category.find({}).exec();

  // if you need to specific user products it would by this
  //  const products = await Product.find({ createdBy: req.user._id })

  const products = await Product.find({})
    .select(
      "_id name price boxStyle productType unit quantity description offer productPictures details category"
    )
    .populate({ path: "category", select: "_id name" })
    .exec();
  //   createdBy: req.user._id

  // .populate({ path: "category", select: "_id name" })
  // .exec();
  //   const orders = await Order.find({})
  //     .populate("items.productId", "name")
  //     .exec();
  res.status(200).json({
    categories: createCategories(categories),
    products,
    // orders,
  });
};
