import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

const corsMiddleware = cors();
app.use(corsMiddleware);

const { DB_HOST, PORT } = process.env;
if (!DB_HOST) {
    console.error('DB_HOST is not defined in environment variables');
    process.exit(1);
  }

mongoose.connect(DB_HOST)
.then(()=> {
    app.listen(PORT, () => console.log('Server is runing!'));
})
.catch(error => {
    console.log(error.message)
    process.exit(1)
})

