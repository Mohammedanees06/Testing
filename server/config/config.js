import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
 await mongoose.connect('mongodb://127.0.0.1:27017/todoappss', {
  useNewUrlParser: true,
});
    console.log(" MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;




















