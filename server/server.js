import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { initialProducts, initialCategories } from './seedData.js';

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atelier_furniture';

app.use(cors());
app.use(express.json());

// In-Memory store fallback
let memoryProducts = [...initialProducts];
let memoryInquiries = [];
let memoryNewsletters = [];
let isMongoConnected = false;

// Mongoose Schema Definitions
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tagline: String,
  category: String,
  price: Number,
  currency: { type: String, default: 'USD' },
  rating: Number,
  reviewsCount: Number,
  dimensions: Object,
  materials: [String],
  features: [String],
  inStock: Boolean,
  leadTime: String,
  heroHighlight: Boolean,
  image: String,
  gallery: [String],
  story: String,
  createdAt: { type: Date, default: Date.now }
});

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  projectType: String,
  selectedProduct: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

let ProductModel;
let InquiryModel;
let NewsletterModel;

try {
  ProductModel = mongoose.model('Product', productSchema);
  InquiryModel = mongoose.model('Inquiry', inquirySchema);
  NewsletterModel = mongoose.model('Newsletter', newsletterSchema);
} catch (e) {
  ProductModel = mongoose.models.Product;
  InquiryModel = mongoose.models.Inquiry;
  NewsletterModel = mongoose.models.Newsletter;
}

// Attempt MongoDB Connection (Non-blocking so server starts immediately)
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    console.log('✨ [MERN] Connected to MongoDB database successfully.');

    // Seed database if empty
    const count = await ProductModel.countDocuments();
    if (count === 0) {
      console.log('🌱 [MERN] Seeding initial luxury furniture collection into MongoDB...');
      await ProductModel.insertMany(initialProducts);
      console.log('✅ [MERN] Database seeded with 6 luxury furniture pieces.');
    }
  } catch (err) {
    console.log('⚠️ [MERN] MongoDB not connected. Operating in resilient In-Memory mode.');
    isMongoConnected = false;
  }
}
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: isMongoConnected ? 'MongoDB Connected' : 'In-Memory Resilient Store',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Products: List with filters & search
app.get('/api/products', async (req, res) => {
  try {
    const { category, search, sort } = req.query;

    if (isMongoConnected) {
      let query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } },
          { story: { $regex: search, $options: 'i' } }
        ];
      }
      let sortOpt = {};
      if (sort === 'price-low') sortOpt.price = 1;
      else if (sort === 'price-high') sortOpt.price = -1;
      else if (sort === 'rating') sortOpt.rating = -1;
      else sortOpt.createdAt = -1;

      const products = await ProductModel.find(query).sort(sortOpt);
      return res.json({ success: true, count: products.length, data: products });
    }

    // In-memory filter
    let results = [...memoryProducts];
    if (category && category !== 'all') {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.tagline.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }

    res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Products: Get Single
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      const product = await ProductModel.findOne({ id });
      if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, data: product });
    }

    const product = memoryProducts.find(p => p.id === id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Products: Create (Admin)
app.post('/api/products', async (req, res) => {
  try {
    const newProduct = {
      ...req.body,
      id: req.body.id || `custom-${Date.now()}`,
      createdAt: new Date()
    };

    if (isMongoConnected) {
      const created = await ProductModel.create(newProduct);
      return res.status(201).json({ success: true, data: created });
    }

    memoryProducts.unshift(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Categories
app.get('/api/categories', (req, res) => {
  res.json({ success: true, data: initialCategories });
});

// Inquiries: Submit bespoke request
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, email, phone, projectType, selectedProduct, message } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const inquiryData = {
      name,
      email,
      phone: phone || '',
      projectType: projectType || 'Residential Interior',
      selectedProduct: selectedProduct || 'Arcos Dining Collection',
      message: message || '',
      createdAt: new Date()
    };

    if (isMongoConnected) {
      const saved = await InquiryModel.create(inquiryData);
      return res.status(201).json({ success: true, message: 'Inquiry received. A private design consultant will contact you within 24 hours.', data: saved });
    }

    memoryInquiries.unshift(inquiryData);
    res.status(201).json({ success: true, message: 'Inquiry received. A private design consultant will contact you within 24 hours.', data: inquiryData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Newsletter: Subscribe
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const subscription = { email, subscribedAt: new Date() };

    if (isMongoConnected) {
      const existing = await NewsletterModel.findOne({ email });
      if (existing) {
        return res.json({ success: true, message: 'You are already subscribed to The Private Gazette.' });
      }
      await NewsletterModel.create(subscription);
      return res.status(201).json({ success: true, message: 'Welcome to The Private Gazette. You will receive private previews and exhibition invitations.' });
    }

    if (memoryNewsletters.some(n => n.email === email)) {
      return res.json({ success: true, message: 'You are already subscribed to The Private Gazette.' });
    }
    memoryNewsletters.push(subscription);
    res.status(201).json({ success: true, message: 'Welcome to The Private Gazette. You will receive private previews and exhibition invitations.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Auth dummy endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'atelier-admin' && password === 'luxury2026') {
    return res.json({
      success: true,
      token: 'jwt-token-luxe-99482482348',
      user: { name: 'Lead Curator', role: 'curator' }
    });
  }
  res.status(401).json({ success: false, message: 'Invalid curator credentials' });
});

app.listen(PORT, () => {
  console.log(`🏛️ [Atelier Luxury API] Server running on port ${PORT}`);
});
