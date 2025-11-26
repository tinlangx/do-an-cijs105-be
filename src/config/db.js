import mongoose from "mongoose";

// Kết nối MongoDB và fail sớm nếu có vấn đề mạng/URI
export async function connectDB(uri) {
  if (!uri) {
    console.error('⚠️ MONGO_URI is not defined');
    throw new Error('MONGO_URI is not defined');
  }

  // Tắt buffer để lỗi hiện ngay nếu không kết nối được
  mongoose.set('bufferCommands', false);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s
      connectTimeoutMS: 10000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}
