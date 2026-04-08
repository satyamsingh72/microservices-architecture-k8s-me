const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/microserviceAuth')
.then(() => console.log('Auth Service: MongoDB Connected'))
.catch(err => console.log('Auth Service: MongoDB Connection Error', err));

// Register API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();
    console.log('User Registered:', email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('SERVER ERROR (Auth Register):', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id.toString(), name: user.name, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    console.log('User Logged In:', email);
    res.json({ token, user: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (err) {
    console.error('SERVER ERROR (Auth Login):', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'auth-service', timestamp: new Date() });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));

// Graceful Shutdown
const shutdown = () => {
  console.log('SIGTERM/SIGINT signal received: closing HTTP server');
  server.close(async () => {
    console.log('HTTP server closed');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
