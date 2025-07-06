import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
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
        <div>Chargement...</div>
      </div>
    );
  }

  // Si déjà authentifié, rediriger vers le dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Sinon, afficher la page publique (login, signup, etc.)
  return children;
};

export default PublicRoute; 