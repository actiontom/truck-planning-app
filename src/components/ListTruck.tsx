import React, { useState, useEffect } from 'react';
import { getTrucks, createTruck, updateTruck, deleteTruck } from '../services/api';
import Modal from './Modal'; // Reuse the Modal component

interface Truck {
  id: string;
  licensePlate: string;
  color: string;
  driverId?: string;
}

const ListTruck: React.FC = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newTruck, setNewTruck] = useState<Truck>({ id: '', licensePlate: '', color: '' });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Validation states
  const [licensePlateError, setLicensePlateError] = useState<string | null>(null);
  const [colorError, setColorError] = useState<string | null>(null);

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
    setNewTruck({ id: '', licensePlate: '', color: '' });
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
            setNewTruck({ id: '', licensePlate: '', color: '' });
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
      </Modal>

      {trucks.length === 0 ? (
        <p>No trucks available</p>
      ) : (
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>License Plate</th>
              <th>Color</th>
              <th>Driver ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map((truck) => (
              <tr key={truck.id}>
                <td>{truck.licensePlate}</td>
                <td>{truck.color}</td>
                <td>{truck.driverId ? truck.driverId : 'Not Assigned'}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(truck)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(truck.id)}>
                    Delete
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
