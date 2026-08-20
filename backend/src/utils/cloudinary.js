import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data; 
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

// Remove image from Cloudinary
const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error) {
    console.error("Error removing image from Cloudinary:", error);
    throw new Error("Cloudinary delete failed");
  }
};

export { cloudinaryUploadImage, cloudinaryRemoveImage };