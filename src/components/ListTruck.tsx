import React, { useState, useEffect } from 'react';
import { getTrucks, createTruck, updateTruck, deleteTruck, assignDriverToTruck } from '../services/api';
import Modal from './Modal';
import AssignDriverModal from './AssignDriverModal';

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

const truckStatuses = [
  'Available',
  'In Transit',
  'Loading',
  'Unloading',
  'Maintenance',
  'Out of Service',
  'Scheduled',
  'En Route to Pickup',
];

const truckTypes = [
  'Flatbed',
  'Refrigerated (Reefer)',
  'Box Truck',
  'Tanker',
  'Dump Truck',
  'Container Truck',
  'Car Carrier',
  'Tow Truck',
  'Garbage Truck',
  'Logging Truck',
  'Cement Mixer',
  'Livestock Truck',
  'Curtainsider',
];

const ListTruck: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTruck, setNewTruck] = useState<Truck>({
    id: '',
    licensePlate: '',
    color: '',
    truckType: '',
    fuelType: '',
    maxLoadCapacity: 0,
    currentLoad: 0,
    fuelCapacity: 0,
    currentFuelLevel: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    status: '',
    location: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [selectedTruckId, setSelectedTruckId] = useState<string>('');

  const handleAssignDriverClick = (truck: Truck) => {
    setSelectedTruckId(truck.id);
    setShowAssignModal(true);
  };

  const handleAssignDriverClose = () => {
    setShowAssignModal(false);
    setSelectedTruckId('');
  };

  const handleDriverAssigned = () => {
    fetchTrucks(); // Re-fetch trucks to update the list
  };

  // Validation states
  const [licensePlateError, setLicensePlateError] = useState<string | null>(null);
  const [colorError, setColorError] = useState<string | null>(null);
  const [driverIdError, setDriverIdError] = useState<string | null>(null);
  const [maxLoadCapacityError, setMaxLoadCapacityError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      const response = await getTrucks();
      setTrucks(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch trucks');
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // License Plate validation
    if (newTruck.licensePlate.trim() === '') {
      setLicensePlateError('License plate is required.');
      isValid = false;
    } else {
      setLicensePlateError(null);
    }

    // Color validation
    if (newTruck.color.trim() === '') {
      setColorError('Color is required.');
      isValid = false;
    } else {
      setColorError(null);
    }

    // maxLoadCapacity validation
    if (newTruck.maxLoadCapacity <= 0) {
      setMaxLoadCapacityError('Max Load Capacity must be greater than 0.');
      isValid = false;
    } else {
      setMaxLoadCapacityError(null);
    }

    // Status validation
    if (newTruck.status.trim() === '') {
      setStatusError('Status is required.');
      isValid = false;
    } else {
      setStatusError(null);
    }

    // Location validation
    if (newTruck.location.trim() === '') {
      setLocationError('Location is required.');
      isValid = false;
    } else {
      setLocationError(null);
    }

    return isValid;
  };

  const handleAddOrEditTruck = async () => {
    if (!validateForm()) {
      return; // Prevent submission if the form is invalid
    }

    if (isEditing) {
      await updateTruck(newTruck.id, newTruck);
    } else {
      await createTruck(newTruck);
    }
    fetchTrucks();
    setNewTruck({
      id: '',
      licensePlate: '',
      color: '',
      truckType: '',
      fuelType: '',
      maxLoadCapacity: 0,
      currentLoad: 0,
      fuelCapacity: 0,
      currentFuelLevel: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      status: '',
      location: '',
    });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleEditClick = (truck: Truck) => {
    setNewTruck(truck);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    await deleteTruck(id);
    fetchTrucks();
  };

  if (loading) return <p>Loading trucks...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>List of Trucks</h3>
        <button
          className="btn btn-success"
          onClick={() => {
            setNewTruck({
              id: '',
              licensePlate: '',
              color: '',
              truckType: '',
              fuelType: '',
              maxLoadCapacity: 0,
              currentLoad: 0,
              fuelCapacity: 0,
              currentFuelLevel: 0,
              dimensions: { length: 0, width: 0, height: 0 },
              status: '',
              location: '',
            });
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          Add Truck
        </button>
      </div>

      {/* Use the Modal component for Add/Edit */}
      <Modal
        title={isEditing ? 'Edit Truck' : 'Add Truck'}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddOrEditTruck}
      >
        <div className="form-group mb-2">
          <label htmlFor="licensePlate">License Plate</label>
          <input
            type="text"
            id="licensePlate"
            className={`form-control ${licensePlateError ? 'is-invalid' : ''}`}
            placeholder="License Plate"
            value={newTruck.licensePlate}
            onChange={(e) => setNewTruck({ ...newTruck, licensePlate: e.target.value })}
          />
          {licensePlateError && <div className="invalid-feedback">{licensePlateError}</div>}
        </div>

        <div className="form-group mb-2">
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            className={`form-control ${colorError ? 'is-invalid' : ''}`}
            placeholder="Color"
            value={newTruck.color}
            onChange={(e) => setNewTruck({ ...newTruck, color: e.target.value })}
          />
          {colorError && <div className="invalid-feedback">{colorError}</div>}
        </div>

        <div className="form-group mb-2">
          <label htmlFor="driverId">Driver Id</label>
          <input
            type="text"
            id="driverId"
            className={`form-control ${driverIdError ? 'is-invalid' : ''}`}
            value={newTruck.driverId}
            onChange={(e) => setNewTruck({ ...newTruck, driverId: e.target.value })}
          />
          {driverIdError && <div className="invalid-feedback">{driverIdError}</div>}
        </div>

        <div className="form-group mb-2">
          <label htmlFor="maxLoadCapacity">Max Load Capacity</label>
          <input
            type="number"
            id="maxLoadCapacity"
            className="form-control"
            placeholder="Max Load Capacity"
            value={newTruck.maxLoadCapacity || 0}
            onChange={(e) => setNewTruck({ ...newTruck, maxLoadCapacity: Number(e.target.value) })}
          />
          {maxLoadCapacityError && <div className="invalid-feedback">{maxLoadCapacityError}</div>}
        </div>

        <div className="form-group mb-2">
          <label htmlFor="currentLoad">Current Load</label>
          <input
            type="number"
            id="currentLoad"
            className="form-control"
            placeholder="Current Load"
            value={newTruck.currentLoad || 0}
            onChange={(e) => setNewTruck({ ...newTruck, currentLoad: Number(e.target.value) })}
          />
        </div>

        <div className="form-group mb-2">
          <label htmlFor="truckType">Truck Type</label>
          <select
            id="truckType"
            className="form-control"
            value={newTruck.truckType || ''}
            onChange={(e) => setNewTruck({ ...newTruck, truckType: e.target.value })}
          >
            <option value="">Select Truck Type</option>
            {truckTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-2">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            className={`form-control ${statusError ? 'is-invalid' : ''}`}
            value={newTruck.status}
            onChange={(e) => setNewTruck({ ...newTruck, status: e.target.value })}
          >
            <option value="">Select Status</option>
            {truckStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {statusError && <div className="invalid-feedback">{statusError}</div>}
        </div>

        <div className="form-group mb-2">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            className={`form-control ${locationError ? 'is-invalid' : ''}`}
            placeholder="Location"
            value={newTruck.location}
            onChange={(e) => setNewTruck({ ...newTruck, location: e.target.value })}
          />
          {locationError && <div className="invalid-feedback">{locationError}</div>}
        </div>
      </Modal>

      {/* Assign Driver Modal */}
      <AssignDriverModal
        truckId={selectedTruckId}
        show={showAssignModal}
        onClose={handleAssignDriverClose}
        onDriverAssigned={handleDriverAssigned}
      />

      {trucks.length === 0 ? (
        <p>No trucks available</p>
      ) : (
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>License Plate</th>
              <th>Location</th>
              <th>Truck Type</th>
              <th>Max Load Capacity</th>
              <th>Driver ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck.id}>
                <td>{truck.licensePlate}</td>
                <td>{truck.location}</td>
                <td>{truck.truckType}</td>
                <td>{truck.maxLoadCapacity}</td>
                <td>{truck.driverId ? truck.driverId : 'Not Assigned'}</td>
                <td>{truck.status}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(truck)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(truck.id)}>
                    Delete
                  </button>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => handleAssignDriverClick(truck)}>
                    Assign Driver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListTruck;
