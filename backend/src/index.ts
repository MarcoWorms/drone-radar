import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { DroneSpotModel } from './models/DroneSpot';
import { DroneSpot, NewDroneSpot } from './types';

const app = express();
const port = process.env.PORT || 3001;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/drone-spots';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/spots', async (req, res) => {
  try {
    const spots = await DroneSpotModel.find();
    res.json(spots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spots' });
  }
});

app.post('/api/spots', async (req, res) => {
  try {
    const newSpot: NewDroneSpot = req.body;
    const spot = await DroneSpotModel.create(newSpot);
    res.status(201).json(spot);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create spot' });
  }
});

app.get('/api/spots/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const spots = await DroneSpotModel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
          },
          $maxDistance: parseInt(radius as string)
        }
      }
    });

    res.json(spots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby spots' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 