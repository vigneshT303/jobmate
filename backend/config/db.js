const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobmate');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    console.error('[Database Error] Action required: Ensure MongoDB Atlas IP Whitelist includes 0.0.0.0/0 (Network Access) and MONGO_URI is set correctly in environment variables.');
  }
};

module.exports = connectDB;
