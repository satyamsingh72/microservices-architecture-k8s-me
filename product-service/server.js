const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/microserviceProducts')
.then(() => console.log('Product Service: MongoDB Connected'))
.catch(err => console.log('Product Service: MongoDB Connection Error', err));

// Add Product API
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'Missing product details' });
    
    const product = new Product({ name, description, price, category, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('SERVER ERROR (Add Product):', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('SERVER ERROR (List Products):', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
