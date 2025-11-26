import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: ['https://do-an-cijs105.vercel.app'],
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Healthcheck DB: báo trạng thái kết nối Mongo
app.get('/health/db', (req, res) => {
  res.json({
    mongoReadyState: mongoose.connection.readyState, // 0=disconnected,1=connected,2=connecting,3=disconnecting
    hasMongoUri: Boolean(process.env.MONGO_URI),
  });
});

app.use('/api/auth', authRoutes);

export default app;
