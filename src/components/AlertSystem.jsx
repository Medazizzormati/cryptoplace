import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeAlert } from '../store/slices/portfolioSlice';
import './AlertSystem.css';

const AlertSystem = () => {
  const dispatch = useDispatch();
  const { alerts } = useSelector(state => state.portfolio);

  const handleRemoveAlert = (id) => {
    dispatch(removeAlert(id));
  };

  // Auto-remove alerts after 5 seconds
  useEffect(() => {
    alerts.forEach((alert) => {
      if (!alert.autoRemoveId) {
        alert.autoRemoveId = setTimeout(() => {
          dispatch(removeAlert(alert.id));
        }, 5000);
      }
    });

    return () => {
      alerts.forEach((alert) => {
        if (alert.autoRemoveId) {
          clearTimeout(alert.autoRemoveId);
        }
      });
    };
  }, [alerts, dispatch]);

  if (alerts.length === 0) return null;

  return (
    <div className="alert-system">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={`alert alert-${alert.type}`}
          onClick={() => handleRemoveAlert(alert.id)}
        >
          <div className="alert-content">
            <div className="alert-icon">
              {alert.type === 'success' && '✅'}
              {alert.type === 'error' && '❌'}
              {alert.type === 'warning' && '⚠️'}
              {alert.type === 'info' && 'ℹ️'}
            </div>
            <div className="alert-message">{alert.message}</div>
            <button className="alert-close" onClick={() => handleRemoveAlert(alert.id)}>
              ×
            </button>
          </div>
          <div className="alert-progress">
            <div className="alert-progress-bar"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlertSystem; 