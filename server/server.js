import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import connectDB from './config/config.js';
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from 'dotenv';

dotenv.config();

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());

await connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);


app.use("/api/admin", adminRoutes);

app.use("/api/users", userRoutes);




app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
  console.log(` http://localhost:${PORT}`);
});
