import express from 'express';
import 'dotenv/config';
import connectDB from './databse/db.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import cors from 'cors';

const app = express();

// ✅ CORS fix
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Required to parse JSON bodies
app.use(express.json());

const PORT = process.env.PORT || 8000;

// Route
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/payment', paymentRoutes);

// Start server
app.listen(PORT, () => {
    connectDB();
    console.log(`server is listening at port: ${PORT}`);
});
