const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const announcementRoutes = require('./routes/announcements');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Allow all origins for development
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inshorts-uni')
.then(() => {
  console.log('MongoDB Connected');
  seedUsers();
})
.catch(err => console.log(err));

// Seed Users
const seedUsers = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    const users = [
      { regId: 'teacher1', password: 'pass123', role: 'teacher' },
      { regId: 'student1', password: 'pass123', role: 'student' }
    ];
    await User.insertMany(users);
    console.log('Users Seeded');
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server - bind to 0.0.0.0 for container deployment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
