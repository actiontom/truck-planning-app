import React, { useState, useEffect } from 'react';
import { getDrivers, createDriver, updateDriver, deleteDriver } from '../services/api';
import Modal from './Modal';
import { Driver } from '../models/Driver';

export const ListDriver: React.FC = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newDriver, setNewDriver] = useState<Driver>({
        id: '',
        name: '',
        licenseNumber: '',
        phoneNumber: '',
        dateOfBirth: '',
        assignedTruckId: '',
        status: 'Available' // Set default status to 'Available'
    });
    
    const [isEditing, setIsEditing] = useState<boolean>(false);

    // Validation states
    const [nameError, setNameError] = useState<string | null>(null);
    const [licenseNumberError, setLicenseNumberError] = useState<string | null>(null);

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

    const validateForm = (): boolean => {
        let isValid = true;

        // Name validation
        if (!newDriver.name || newDriver.name.trim() === '') {
            setNameError('Name is required.');
            isValid = false;
        } else {
            setNameError(null);
        }

        // License Number validation
        if (!newDriver.licenseNumber || newDriver.licenseNumber.trim() === '') {
            setLicenseNumberError('License number is required.');
            isValid = false;
        } else {
            setLicenseNumberError(null);
        }

        return isValid;
    };

    const handleAddOrEditDriver = async () => {
        if (!validateForm()) {
            return; // Prevent submission if the form is invalid
        }
    
        try {
            // Create a new driverData object with all necessary properties set
            const driverData: Required<Driver> = {
                id: newDriver.id || '', // Ensure id is not undefined
                name: newDriver.name || '', // Ensure name is not undefined
                licenseNumber: newDriver.licenseNumber || '', // Ensure licenseNumber is not undefined
                phoneNumber: newDriver.phoneNumber || '', // Provide a default value
                dateOfBirth: newDriver.dateOfBirth || '', // Provide a default value
                assignedTruckId: newDriver.assignedTruckId || '', // Provide a default value
                status: newDriver.status || 'Available' // Provide a default value
            };
    
            if (isEditing && driverData.id) {
                await updateDriver(driverData.id, driverData);
            } else {
                await createDriver(driverData);
            }
    
            fetchDrivers();
            setNewDriver({
                id: '',
                name: '',
                licenseNumber: '',
                phoneNumber: '',
                dateOfBirth: '',
                assignedTruckId: '',
                status: 'Available'
            });
            setIsEditing(false);
            setShowModal(false);
        } catch (error) {
            setError('Failed to save driver.');
        }
    };
    
    

    const handleEditClick = (driver: Driver) => {
        setNewDriver(driver);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteClick = async (id: string) => {
        try {
            await deleteDriver(id);
            fetchDrivers();
        } catch {
            setError('Failed to delete driver.');
        }
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
                        setNewDriver({ id: '', name: '', licenseNumber: '', phoneNumber: '', dateOfBirth: '', assignedTruckId: '' });
                        setIsEditing(false);
                        setShowModal(true);
                    }}
                >
                    Add Driver
                </button>
            </div>

            {/* Modal for Add/Edit */}
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
                        className={`form-control ${nameError ? 'is-invalid' : ''}`}
                        placeholder="Name"
                        value={newDriver.name || ''}
                        onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    />
                    {nameError && <div className="invalid-feedback">{nameError}</div>}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="licenseNumber">License Number</label>
                    <input
                        type="text"
                        id="licenseNumber"
                        className={`form-control ${licenseNumberError ? 'is-invalid' : ''}`}
                        placeholder="License Number"
                        value={newDriver.licenseNumber || ''}
                        onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                    />
                    {licenseNumberError && <div className="invalid-feedback">{licenseNumberError}</div>}
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        className="form-control"
                        placeholder="Phone Number"
                        value={newDriver.phoneNumber || ''}
                        onChange={(e) => setNewDriver({ ...newDriver, phoneNumber: e.target.value })}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input
                        type="date"
                        id="dateOfBirth"
                        className="form-control"
                        value={newDriver.dateOfBirth || ''}
                        onChange={(e) => setNewDriver({ ...newDriver, dateOfBirth: e.target.value })}
                    />
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="assignedTruckId">Assigned Truck ID</label>
                    <input
                        type="text"
                        id="assignedTruckId"
                        className="form-control"
                        placeholder="Truck ID"
                        value={newDriver.assignedTruckId || ''}
                        onChange={(e) => setNewDriver({ ...newDriver, assignedTruckId: e.target.value })}
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
                            <th>Phone Number</th>
                            <th>Date of Birth</th>
                            <th>Assigned Truck ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {drivers.map((driver) => (
                            <tr key={driver.id}>
                                <td>{driver.name}</td>
                                <td>{driver.licenseNumber}</td>
                                <td>{driver.phoneNumber}</td>
                                <td>{driver.dateOfBirth}</td>
                                <td>{driver.assignedTruckId || 'Not Assigned'}</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(driver)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(driver.id!)}>
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
