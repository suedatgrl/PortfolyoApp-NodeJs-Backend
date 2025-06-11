const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = require('./models');

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/messages', require('./routes/messageRoutes'));
app.use('/posts', require('./routes/postRoutes')); // Yeni eklenen rota

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio App API is running' });
});

// Sync database and start server
db.sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });