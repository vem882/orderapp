const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { AfterShip } = require('aftership');
const { AFTERSHIP_API_KEY } = require('../config/config');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Shipment = mongoose.model('Shipment', new mongoose.Schema({
  orderNumber: String,
  itemCount: Number,
  courier: String,
  trackingNumber: String,
}));

const User = mongoose.model('User', new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
}));



const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  console.log('User created successfully:', username);
};
// Helper function to convert _id to id for react-admin
const convertId = (doc) => {
  return {
    ...doc.toObject(),
    id: doc._id,
  };
};
///createUser('vem882', 'XXX');

const SECRET_KEY = process.env.SECRETkey;

app.post('/api/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = new User({ username: req.body.username, password: hashedPassword });
  await user.save();
  res.status(201).send({ message: 'User registered successfully' });
});

app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send({ message: 'Invalid username or password' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({ message: 'Invalid username or password' });

  const token = jwt.sign({ _id: user._id, username: user.username }, SECRET_KEY);
  res.send({ token });
});

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Invalid token.' });
    req.user = decoded;
    next();
  });
};

// Get all shipments
app.get("/api/shipments", async (req, res) => {
  const shipments = await Shipment.find({});
  res.set("X-Total-Count", shipments.length);
  
  // Convert _id to id for react-admin
  const shipmentsWithId = shipments.map((shipment) => {
    return {
      ...shipment.toObject(),
      id: shipment._id,
    };
  });

  res.json(shipmentsWithId);
});

// Get a specific shipment
app.get("/api/shipments/:trackingNumber", async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ trackingNumber: req.params.trackingNumber });

    if (!shipment) {
      res.status(404).json({ error: "Shipment not found" });
      return;
    }

    res.json(convertId(shipment));
  } catch (err) {
    console.error("Error fetching shipment data", err);
    res.status(500).json({ error: "Error fetching shipment data" });
  }
});


// Create a new shipment
app.post("/api/shipments", async (req, res) => {
const newShipment = new Shipment(req.body);
await newShipment.save();
res.json(convertId(newShipment));
});

// Update an existing shipment
app.put("/api/shipments/:id", async (req, res) => {
const updatedShipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(convertId(updatedShipment));
});

// Delete a shipment
app.delete("/api/shipments/:id", async (req, res) => {
  await Shipment.findByIdAndRemove(req.params.id);
  res.sendStatus(204);
});

// Get tracking data for a specific shipment
app.get("/api/shipments/:id/track", async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      res.status(404).json({ error: "Shipment not found" });
      return;
    }

    const response = await aftership.tracking.get(shipment.courier, shipment.trackingNumber);
    res.json(res.json(convertId(response.data.tracking)));
  } catch (err) {
    console.error("Error fetching tracking data", err);
    res.status(500).json({ error: "Error fetching tracking data" });
  }
});

const aftership = new AfterShip(AFTERSHIP_API_KEY);

app.get('/api/tracking/:tracking_number', authenticateJWT, async (req, res) => {
  try {
    const trackingData = await aftership.tracking.get(req.params.courier, req.params.tracking_number);
    res.send(trackingData);
  } catch (err) {
    res.status(err.statusCode || 500).send({ message: err.message });
  }
});

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
