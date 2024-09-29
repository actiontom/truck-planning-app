import axios from 'axios';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Truck-related API calls
export const getTrucks = () => api.get('/trucks');
export const createTruck = (truck: { licensePlate: string; color: string; driverId?: string }) =>
  api.post('/trucks', truck);
export const updateTruck = (id: string, truck: { licensePlate: string; color: string; driverId?: string }) =>
  api.put(`/trucks/${id}`, truck);
export const deleteTruck = (id: string) => api.delete(`/trucks/${id}`);

// Driver-related API calls
export const getDrivers = () => api.get('/drivers');
export const createDriver = (driver: { name: string; licenseNumber: string }) =>
  api.post('/drivers', driver);
export const updateDriver = (id: string, driver: { name: string; licenseNumber: string }) =>
  api.put(`/drivers/${id}`, driver);
export const deleteDriver = (id: string) => api.delete(`/drivers/${id}`);
