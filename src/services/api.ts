import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Base URL for the backend API

// Truck Model
interface Truck {
  id: string;
  licensePlate: string;
  color: string;
  driverId?: string;
  maxLoadCapacity: number;
  currentLoad?: number;
  truckType?: string;
  fuelType?: string;
  fuelCapacity?: number;
  currentFuelLevel?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  registrationDate?: string;
  nextMaintenanceDate?: string;
  status: string;
  odometerReading?: number;
  location: string;
}

// Driver Model
interface Driver {
  id?: string;
  name: string;
  licenseNumber: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  assignedTruckId?: string;
}

// Get all trucks
export const getTrucks = () => {
  return axios.get(`${API_URL}/trucks`);
};

// Create a new truck
export const createTruck = (truck: Truck) => {
  return axios.post(`${API_URL}/trucks`, truck);
};

// Update a truck by ID
export const updateTruck = (id: string, truck: Truck) => {
  return axios.put(`${API_URL}/trucks/${id}`, truck);
};

// Delete a truck by ID
export const deleteTruck = (id: string) => {
  return axios.delete(`${API_URL}/trucks/${id}`);
};

// Get all drivers
export const getDrivers = () => {
  return axios.get(`${API_URL}/drivers`);
};

// Create a new driver
export const createDriver = (driver: Driver) => {
  return axios.post(`${API_URL}/drivers`, driver);
};

// Update a driver by ID
export const updateDriver = (id: string, driver: Driver) => {
  return axios.put(`${API_URL}/drivers/${id}`, driver);
};

// Delete a driver by ID
export const deleteDriver = (id: string) => {
  return axios.delete(`${API_URL}/drivers/${id}`);
};

// Assign a driver to a truck
export const assignDriverToTruck = (truckId: string, driverId: string) => {
  return axios.post(`${API_URL}/trucks/${truckId}/assign-driver/${ driverId }`);
};
