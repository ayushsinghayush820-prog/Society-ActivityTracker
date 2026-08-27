const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Production Security Headers
app.use(helmet());

// Rate Limiting to prevent DDoS / Brute Force
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
  origin: ['https://society-activity-tracker-xi.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/events', require('./src/routes/eventRoutes'));
app.use('/api/attendance', require('./src/routes/attendanceRoutes'));
app.use('/api/contributions', require('./src/routes/contributionRoutes'));
app.use('/api/users', require('./src/routes/userRoutes'));

// Health check route for deployment platforms (Render, Vercel, AWS)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Production Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});