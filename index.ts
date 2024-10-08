import express from 'express';
import cloudinary from "./helpers/cloudinary.js";

const app = express();

app.listen(3000, () => console.log('Server is runing!'));
