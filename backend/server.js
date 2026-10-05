const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const companyRoutes = require('./routes/companyRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedJobRoutes = require('./routes/savedJobRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

connectDB();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

const allowedOrigins = [
 "https://jobmate-frontend.onrender.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

app.use("/",async (req,res) => {
  res.json({message:"hello welcome"})
})
app.use('/api', limiter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'JobMate API is healthy and operational',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-jobs', savedJobRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/admin', adminRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT ;

const server = app.listen(PORT, () => {
  console.log(`Server start ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`[UnhandledRejection] ${err.message}`);
});

module.exports = app;
