import { createSlice } from '@reduxjs/toolkit';

// Fonction utilitaire pour vérifier si un token est valide
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    // Pour un vrai JWT, on devrait décoder et vérifier l'expiration
    // Ici on fait une vérification simple
    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp * 1000 < Date.now();
    return !isExpired;
  } catch (error) {
    // Si ce n'est pas un JWT valide (mode demo), on accepte
    return token.startsWith('demo-') || token.length > 10;
  }
};

// État initial
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true, // true au démarrage pour vérifier l'auth
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action pour vérifier le statut d'authentification au démarrage
    checkAuthStatus: (state) => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedToken && isTokenValid(storedToken)) {
        state.token = storedToken;
        state.refreshToken = storedRefreshToken;
        state.user = storedUser ? JSON.parse(storedUser) : null;
        state.isAuthenticated = true;
      } else {
        // Token invalide ou expiré, nettoyer le localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        state.token = null;
        state.user = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      }
      
      state.loading = false;
    },

    // Début du processus de connexion
    setLoading: (state, action) => {
      state.loading = action.payload;
      state.error = null;
    },

    // Connexion réussie
    loginSuccess: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Sauvegarder dans localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },

    // Échec de connexion
    loginFailure: (state, action) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;

      // Nettoyer le localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    },

    // Déconnexion
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      // Nettoyer le localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
    },

    // Nettoyer les erreurs
    clearError: (state) => {
      state.error = null;
    },

    // Mettre à jour le profil utilisateur
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },

    // Renouveler le token
    refreshTokenSuccess: (state, action) => {
      const { token, refreshToken } = action.payload;
      state.token = token;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
      
      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
  },
});

export const {
  checkAuthStatus,
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateProfile,
  refreshTokenSuccess,
} = authSlice.actions;

export default authSlice.reducer; 