export type DroneType = 'tinywhoop' | 'toothpick' | '5-inch';

export interface DroneSpot {
  id?: string;
  name: string;
  description?: string;
  types: DroneType[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface NewDroneSpot {
  name: string;
  description?: string;
  types: DroneType[];
  location: {
    lat: number;
    lng: number;
  };
} 