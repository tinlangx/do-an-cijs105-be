// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// middlewares
app.use(
    cors({
        origin: [
            'https://do-an-cijs105-fe.vercel.app'
        ],
        credentials: true,
    })
);


app.use(express.json());

// ----- Mongoose model -----
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, minlength: 6 },
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// ----- Kết nối MongoDB -----
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('MongoDB error:', err));
console.log("connect succes")

// ----- Routes Auth -----

// Đăng ký
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: 'Thiếu name, email hoặc password' });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });

        return res.status(201).json({
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi server' });
    }
});

// Đăng nhập
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: 'Thiếu email hoặc password' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: 'Sai email hoặc mật khẩu' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: 'Sai email hoặc mật khẩu' });
        }

        return res.json({
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Lỗi server' });
    }
});


app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

// ----- Start server -----
app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
});
