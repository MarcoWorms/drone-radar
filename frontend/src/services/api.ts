import axios from 'axios';
import { DroneSpot, NewDroneSpot } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
  getSpots: async (): Promise<DroneSpot[]> => {
    const response = await axios.get(`${API_URL}/spots`);
    return response.data;
  },

  createSpot: async (spot: NewDroneSpot): Promise<DroneSpot> => {
    const response = await axios.post(`${API_URL}/spots`, spot);
    return response.data;
  },

  getNearbySpots: async (lat: number, lng: number, radius?: number): Promise<DroneSpot[]> => {
    const response = await axios.get(`${API_URL}/spots/nearby`, {
      params: { lat, lng, radius }
    });
    return response.data;
  }
}; 