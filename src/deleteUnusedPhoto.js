// deleteUnusedPhotos.js
const fs = require("fs");
const path = require("path");
const Category = require("./models/category");
const Product = require("./models/product");

const fetchPhotosFromDatabase = async () => {
  try {
    const categoryPhotos = await Category.find({}).distinct("categoryImage");
    const productPhotos = await Product.find({}).distinct("productPictures");

    return [...categoryPhotos, ...productPhotos];
  } catch (error) {
    console.error("Error fetching photos from the database:", error);
    return [];
  }
};

const getPhotosInUploadsFolder = () => {
  const uploadsFolder = path.join(__dirname, "uploads");
  try {
    const filenames = fs.readdirSync(uploadsFolder);
    return filenames;
  } catch (error) {
    console.error("Error reading uploads folder:", error);
    return [];
  }
};

const deleteUnusedPhotos = async () => {
  const databasePhotos = await fetchPhotosFromDatabase();
  const uploadsPhotos = getPhotosInUploadsFolder();

  const unusedPhotos = uploadsPhotos.filter(
    (filename) => !databasePhotos.includes(filename)
  );

  unusedPhotos.forEach((filename) => {
    const filePath = path.join(__dirname, "uploads", filename);
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error("Error deleting photo:", error);
      } else {
        console.log("Deleted photo:", filename);
      }
    });
  });
};

deleteUnusedPhotos();
