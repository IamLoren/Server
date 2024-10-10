import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
dotenv.config();
const app = express();
const corsMiddleware = cors();
app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use((_, res) => {
    res.status(404).json({ message: "Not found" });
});
const { DB_HOST, PORT } = process.env;
if (!DB_HOST) {
    console.error('DB_HOST is not defined in environment variables');
    process.exit(1);
}
mongoose.connect(DB_HOST)
    .then(() => {
    app.listen(PORT, () => console.log('Server is runing!'));
})
    .catch(error => {
    console.log(error.message);
    process.exit(1);
});
//# sourceMappingURL=index.js.map