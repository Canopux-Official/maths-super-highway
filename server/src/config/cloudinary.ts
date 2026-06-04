import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Configure cloudinary using CLOUDINARY_URL if available
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    // Cloudinary will automatically pick up CLOUDINARY_URL from process.env,
    // but calling config() ensures it initializes.
  });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn("Cloudinary configuration not found in environment variables.");
}

export default cloudinary;
