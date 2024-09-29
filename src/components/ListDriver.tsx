import React, { useState, useEffect } from 'react';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../services/api';
import Modal from './Modal'; // Reuse the Modal component

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
}

const ListDriver: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newDriver, setNewDriver] = useState<Driver>({ id: '', name: '', licenseNumber: '' });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await getDrivers();
      setDrivers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch drivers');
      setLoading(false);
    }
  };

  const handleAddOrEditDriver = async () => {
    if (isEditing) {
      await updateDriver(newDriver.id, newDriver);
    } else {
      await createDriver(newDriver);
    }
    fetchDrivers();
    setNewDriver({ id: '', name: '', licenseNumber: '' });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleEditClick = (driver: Driver) => {
    setNewDriver(driver);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDeleteClick = async (id: string) => {
    await deleteDriver(id);
    fetchDrivers();
  };

  if (loading) return <p>Loading drivers...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>List of Drivers</h3>
        <button
          className="btn btn-success"
          onClick={() => {
            setNewDriver({ id: '', name: '', licenseNumber: '' });
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          Add Driver
        </button>
      </div>

      {/* Use the Modal component for Add/Edit */}
      <Modal
        title={isEditing ? 'Edit Driver' : 'Add Driver'}
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddOrEditDriver}
      >
        <div className="form-group mb-2">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Driver Name"
            value={newDriver.name}
            onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
          />
        </div>
        <div className="form-group mb-2">
          <label htmlFor="licenseNumber">License Number</label>
          <input
            type="text"
            id="licenseNumber"
            className="form-control"
            placeholder="License Number"
            value={newDriver.licenseNumber}
            onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
          />
        </div>
      </Modal>

      {drivers.length === 0 ? (
        <p>No drivers available</p>
      ) : (
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>License Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.name}</td>
                <td>{driver.licenseNumber}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(driver)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(driver.id)}>
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

export default ListDriver;
