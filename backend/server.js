import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import Products from './models/Products.js';

dotenv.config();

// Check environment variables
console.log('🔍 Environment Configuration Check:');
console.log('  DB:', process.env.DB ? '✅ Set' : '❌ Missing');
console.log('  PORT:', process.env.PORT || '7000 (default)');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('  EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('  EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');

// Connect to Database
connectDB();

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Add your Vercel URL as environment variable
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true
}));

app.use(express.json());


//Import Routes
import authRoutes from './routes/user.js';
import productRoutes from './routes/productRoutes.js';

app.use('/api/admin/products', productRoutes);
app.use("/api/products", productRoutes);

// use Routes

app.use('/api/auth', authRoutes);



const PORT = process.env.PORT || 7000;


app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}`);
});

