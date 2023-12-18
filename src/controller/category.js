const Category = require("../models/category");
const slugify = require("slugify");
const shortid = require("shortid");
const { uploadOnCloudinary } = require("../../utils/cloudinary.js");

const createCategories = (categories, parentId = null) => {
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
      categoryImage: cate.categoryImage,
      parentId: cate.parentId,
      type: cate.type,
      children: createCategories(categories, cate._id),
    });
  }

  return categoryList;
};

exports.addCategory = async (req, res) => {
  const categoryObj = {
    name: req.body.name,
    slug: `${slugify(req.body.name)}-${shortid.generate()}`,
    createdBy: req.user._id,
  };

  if (req.file) {
    const response = await uploadOnCloudinary(req.file.path);
    categoryObj.categoryImage = response.url;
  }
  if (req.body.parentId) {
    categoryObj.parentId = req.body.parentId;
  }
  const cat = new Category(categoryObj);

  cat
    .save()
    .then((category) => {
      return res.status(201).json({ category });
    })
    .catch((error) => {
      return res.status(400).json({ error });
    });
};
exports.getCategories = (req, res) => {
  Category.find({})
    .exec()
    .then((categories) => {
      const categoryList = createCategories(categories);
      res.status(200).json({ categoryList });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getCategoriesByName = async (req, res) => {
  const { name } = req.query;

  try {
    // Find the category with the specified name
    const category = await Category.findOne({ name: name });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Find all categories that have the current category's ID as their parent ID
    const childCategories = await Category.find({ parentId: category._id });
    res.status(200).json({ category, childCategories });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateCategories = async (req, res) => {
  const { _id, name, categoryImage } = req.body;
  const category = {};
  if (name) {
    category.name = name;
  }
  if (categoryImage) {
    category.categoryImage = categoryImage;
  }
  const updatedCategory = await Category.findOneAndUpdate({ _id }, category);
  return res.status(201).json({ updatedCategory });
};
//   const updatedCategories = [];
//   try {
//     // Find the category by ID
//     const category = await Category.findById(_id);

//     // If the category is not found, return an error response
//     if (!category) {
//       return res.status(404).json({ error: "Category not found" });
//     }
//     let update = await Category.findOneAndUpdate({ _id }, { name: name });
//     console.log("Update", update);
//     res.status(201).json({ update });
//     // // Update the necessary fields
//     // category.name = name;
//     // category.categoryImage = categoryImage;

//     // // Save the updated category to the database
//     // const updatedCategory = await category.save();

//     // // Return a success response with the updated category data
//     // res.json({ category: updatedCategory });
//   } catch (error) {
//     // Handle any errors that occur during the update process
//     res.status(500).json({ error: "Failed to update category" });
//   }
// };

exports.deleteCategory = async (req, res) => {
  const { _id } = req.body;
  console.log("Req body: ", req.body);
  const deletedCategory = await Category.findOneAndDelete({
    _id,
  });
  console.log("Deleted Category: ", deletedCategory);
  if (deletedCategory) {
    res.status(201).json({ message: "Category removed" });
  } else {
    res.status(400).json({ message: "Something went wrong" });
  }
};

///for ctegory function
