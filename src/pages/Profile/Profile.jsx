import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Mon Profil</h2>
        <div className="profile-info">
          <div className="info-group">
            <label>Nom d'utilisateur:</label>
            <p>{user?.username || 'Non spécifié'}</p>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <p>{user?.email || 'Non spécifié'}</p>
          </div>
          <div className="info-group">
            <label>Statut:</label>
            <p className="status">✅ Connecté</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="edit-btn">Modifier le profil</button>
          <button className="logout-btn" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile; 