var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import cloudinary from "./helpers/cloudinary.js";
const app = express();
app.listen(3000, () => console.log('Server is runing!'));
const uploadImage = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        folder: 'cars',
    };
    try {
        const result = yield cloudinary.uploader.upload(imagePath, options);
        console.log(result);
        return result.public_id;
    }
    catch (error) {
        console.error(error);
    }
});
uploadImage('./assets/mitsubishi_lancer_black.webp');
