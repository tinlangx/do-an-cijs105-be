import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    console.error('⚠️ MONGO_URI is not defined');
    throw new Error('MONGO_URI is not defined');
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}
