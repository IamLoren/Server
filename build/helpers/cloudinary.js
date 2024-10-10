import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const { CLOUDINARY_KEY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_API_KEY } = process.env;
cloudinary.config({
    cloud_name: CLOUDINARY_KEY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_API_KEY,
    secure: true
});
export default cloudinary;
//# sourceMappingURL=cloudinary.js.map