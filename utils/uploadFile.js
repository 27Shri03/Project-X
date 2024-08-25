import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

export const uploadFile = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'user_uploads',
        });
        // Remove the file from the server after uploading
        return result.secure_url;
    } catch (error) {
        throw error;
    } finally {
        fs.unlinkSync(filePath);
    }
}