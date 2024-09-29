export interface Truck {
  id: string;
  licensePlate: string;
  color: string;
  driverId: string;
  maxLoadCapacity: number;
  currentLoad: number;
  truckType: string;
  fuelType: string;
  fuelCapacity: number;
  currentFuelLevel: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  registrationDate: string;
  nextMaintenanceDate: string;
  status: string;
  odometerReading: number;
  location: string;
}
