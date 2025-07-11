import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  // Afficher un loading pendant la vérification de l'auth
  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px'
      }}>
        <div>Vérification de l'authentification...</div>
      </div>
    );
  }

  // Si non authentifié, rediriger vers login avec l'état de la page demandée
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si authentifié, afficher le contenu protégé
  return children;
};

export default ProtectedRoute; 