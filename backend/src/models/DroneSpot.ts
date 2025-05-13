import mongoose, { Schema } from 'mongoose';
import { DroneSpot } from '../types';

const droneSpotSchema = new Schema<DroneSpot>({
  name: { type: String, required: true },
  description: { type: String },
  types: [{ type: String, enum: ['tinywhoop', 'toothpick', '5-inch'], required: true }],
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
}, {
  timestamps: true
});

export const DroneSpotModel = mongoose.model<DroneSpot>('DroneSpot', droneSpotSchema); 