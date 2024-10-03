import React, { useState, useEffect } from 'react';
import { getDrivers, assignDriverToTruck } from '../services/api';
import './AssignDriverModal.css'; // Import the custom CSS for modal styling

interface AssignDriverModalProps {
    truckId: string;
    show: boolean;
    onClose: () => void;
    onDriverAssigned: () => void;
}

interface Driver {
    id: string;
    name: string;
    status: string;
}

const AssignDriverModal: React.FC<AssignDriverModalProps> = ({ truckId, show, onClose, onDriverAssigned }) => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedDriverId, setSelectedDriverId] = useState<string>('');

    useEffect(() => {
        if (show) {
            fetchAvailableDrivers();
        }
    }, [show]);

    const fetchAvailableDrivers = async () => {
        try {
            const response = await getDrivers();
            const availableDrivers = response.data.filter((driver: Driver) => driver.status === 'Available');
            setDrivers(availableDrivers);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    const handleAssign = async () => {
        if (selectedDriverId) {
            try {
                await assignDriverToTruck(truckId, selectedDriverId);
                onDriverAssigned(); // Notify parent component to refresh truck list
                onClose(); // Close the modal
            } catch (error) {
                console.error('Error assigning driver:', error);
            }
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h4>Assign Driver</h4>
                <div className="form-group">
                    <label htmlFor="driverSelect">Select Driver</label>
                    <select
                        id="driverSelect"
                        className="form-control"
                        value={selectedDriverId}
                        onChange={(e) => setSelectedDriverId(e.target.value)}
                    >
                        <option value="">Select a Driver</option>
                        {drivers.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                                {driver.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="modal-buttons">
                    <button className="btn btn-primary mt-3" onClick={handleAssign}>
                        Assign
                    </button>
                    <button className="btn btn-secondary mt-3" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignDriverModal;
