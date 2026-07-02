import mongoose from "mongoose";

const connectDB = async () => {

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err; // Re-throw the error to be caught by the caller
  }
};

export default connectDB;