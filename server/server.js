require('dotenv').config();
const express = require('express');
const cors = require('cors');
const voterRoutes = require('./routes/voter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Logging Middleware
app.use((req, res, next) => {
   console.log(`[Request] ${req.method} ${req.path}`);
   next();
});

// Routes
app.use('/api/voters', voterRoutes);

// Database Connection (Sequelize)
const sequelize = require('./config/database');

const connectDB = async () => {
   try {
      console.log('Attempting to connect to SQL Database...');
      await sequelize.authenticate();
      console.log('✅ SQL Database Connected');

      // Sync models (Safe for dev, creates tables if missing)
      await sequelize.sync();
      console.log('✅ Models Synced');
   } catch (err) {
      console.error('❌ Database Connection Error:', err.message);
   }
};

connectDB();

// Basic Route
app.get('/', (req, res) => {
   res.send('E-Voting API is Running');
});

// Start Server
const server = app.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
});

server.on('error', (err) => {
   console.error('❌ Server Error:', err);
});
