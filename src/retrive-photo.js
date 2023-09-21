const fs = require("fs");
const path = require("path");

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

const photosInUploads = getPhotosInUploadsFolder();
console.log("Photos in uploads folder:", photosInUploads);
