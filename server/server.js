import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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

// API routes

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Serve frontend static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist')));

// React routing fallback (must be last!)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend + Backend: http://localhost:${PORT}`);
});
