const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/microserviceOrders')
.then(() => console.log('Order Service: MongoDB Connected'))
.catch(err => console.log('Order Service: MongoDB Connection Error', err));

// Place Order API
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    console.log('Order Request Received:', { userId, itemsCount: items?.length, totalAmount });
    
    if (!userId || !items || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const order = new Order({ userId, items, totalAmount });
    await order.save();
    console.log('Order Saved Successfully:', order._id);
    res.status(201).json(order);
  } catch (err) {
    console.error('SERVER ERROR (Order Service):', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get User Orders API
app.get('/api/orders/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('SERVER ERROR (Order History):', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Health Check API
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'order-service', timestamp: new Date() });
});

const PORT = process.env.PORT || 5003;
const server = app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));

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
