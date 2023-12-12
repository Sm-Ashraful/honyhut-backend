const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: "dwlowabln",
  api_key: "967599768873719",
  api_secret: "QTlQHXCZzpy3F3JLTZKTi2j5duI",
});

exports.uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    console.log("Error: ", error);
    return null;
  }
};
