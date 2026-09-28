import React from 'react';

const AlertMessage = ({ type = 'danger', message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'warning':
        return 'bi-exclamation-triangle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-x-circle-fill';
    }
  };

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show d-flex align-items-center shadow-sm mb-4`}
      role="alert"
    >
      <i className={`bi ${getIcon()} me-2 fs-5`}></i>
      <div className="flex-grow-1">{message}</div>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;
