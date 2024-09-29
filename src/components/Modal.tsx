import React from 'react';
import './Modal.css'; 

interface ModalProps {
  title: string;
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, show, onClose, onSave, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onSave}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
