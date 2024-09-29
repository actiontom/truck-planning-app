import React, { useState, useEffect } from 'react';
import { getTrucks, createTruck, updateTruck, deleteTruck } from '../services/api';

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
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newTruck, setNewTruck] = useState<Truck>({ id: '', licensePlate: '', color: '' });
  const [isEditing, setIsEditing] = useState<boolean>(false);

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

  const handleAddOrEditTruck = async () => {
    if (isEditing) {
      await updateTruck(newTruck.id, newTruck);
    } else {
      await createTruck(newTruck);
    }
    fetchTrucks();
    setNewTruck({ id: '', licensePlate: '', color: '' });
    setIsEditing(false);
    setShowForm(false);
  };

  const handleEditClick = (truck: Truck) => {
    setNewTruck(truck);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (id: string) => {
    await deleteTruck(id);
    fetchTrucks();
  };

  if (loading) return <p>Loading trucks...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="mt-4">
      <h3 className="mb-3">List of Trucks</h3>
      <button
        className="btn btn-success mb-3"
        onClick={() => {
          setNewTruck({ id: '', licensePlate: '', color: '' });
          setIsEditing(false);
          setShowForm(true);
        }}
      >
        Add Truck
      </button>

      {showForm && (
        <div className="mb-3">
          <h4>{isEditing ? 'Edit Truck' : 'Add Truck'}</h4>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="License Plate"
            value={newTruck.licensePlate}
            onChange={(e) => setNewTruck({ ...newTruck, licensePlate: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Color"
            value={newTruck.color}
            onChange={(e) => setNewTruck({ ...newTruck, color: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleAddOrEditTruck}>
            {isEditing ? 'Update Truck' : 'Add Truck'}
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </div>
      )}

      {trucks.length === 0 ? (
        <p>No trucks available</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
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
