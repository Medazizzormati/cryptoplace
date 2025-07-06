import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // User profile
  profile: {
    id: null,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    createdAt: null,
    updatedAt: null,
    role: 'USER',
  },
  
  // User statistics
  stats: {
    totalHoldings: 0,
    totalPortfolioValue: 0,
    totalTransactions: 0,
  },
  
  // User preferences
  preferences: {
    currency: 'USD',
    theme: 'light',
    emailNotifications: true,
    priceAlerts: true,
    language: 'en',
    dashboardLayout: 'grid',
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
  },
  
  // UI states
  loading: false,
  error: null,
  
  // Profile editing
  isEditingProfile: false,
  profileForm: {
    firstName: '',
    lastName: '',
    email: '',
  },
  
  // Password change
  isChangingPassword: false,
  passwordForm: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  
  // Notifications
  notifications: [],
  unreadNotifications: 0,
  
  // Settings
  settings: {
    twoFactorEnabled: false,
    marketingEmails: true,
    securityAlerts: true,
    loginAlerts: true,
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user profile
    setProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    
    // Set user statistics
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    // Set user preferences
    setPreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    
    // Update specific preference
    updatePreference: (state, action) => {
      const { key, value } = action.payload;
      state.preferences[key] = value;
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    
    // Load preferences from localStorage
    loadPreferences: (state) => {
      const saved = localStorage.getItem('userPreferences');
      if (saved) {
        try {
          state.preferences = { ...state.preferences, ...JSON.parse(saved) };
        } catch (error) {
          console.error('Error loading preferences:', error);
        }
      }
    },
    
    // Set loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Profile editing
    startEditingProfile: (state) => {
      state.isEditingProfile = true;
      state.profileForm = {
        firstName: state.profile.firstName,
        lastName: state.profile.lastName,
        email: state.profile.email,
      };
    },
    
    stopEditingProfile: (state) => {
      state.isEditingProfile = false;
      state.profileForm = {
        firstName: '',
        lastName: '',
        email: '',
      };
    },
    
    updateProfileForm: (state, action) => {
      state.profileForm = { ...state.profileForm, ...action.payload };
    },
    
    // Password change
    startChangingPassword: (state) => {
      state.isChangingPassword = true;
    },
    
    stopChangingPassword: (state) => {
      state.isChangingPassword = false;
      state.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      };
    },
    
    updatePasswordForm: (state, action) => {
      state.passwordForm = { ...state.passwordForm, ...action.payload };
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
      state.unreadNotifications += 1;
    },
    
    markNotificationAsRead: (state, action) => {
      const id = action.payload;
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadNotifications -= 1;
      }
    },
    
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
      state.unreadNotifications = 0;
    },
    
    removeNotification: (state, action) => {
      const id = action.payload;
      const index = state.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        const notification = state.notifications[index];
        if (!notification.read) {
          state.unreadNotifications -= 1;
        }
        state.notifications.splice(index, 1);
      }
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadNotifications = 0;
    },
    
    // Settings
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    
    updateSetting: (state, action) => {
      const { key, value } = action.payload;
      state.settings[key] = value;
    },
    
    // Theme
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    
    // Currency
    setCurrency: (state, action) => {
      state.preferences.currency = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    
    // Language
    setLanguage: (state, action) => {
      state.preferences.language = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    
    // Dashboard layout
    setDashboardLayout: (state, action) => {
      state.preferences.dashboardLayout = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    
    // Auto refresh
    setAutoRefresh: (state, action) => {
      state.preferences.autoRefresh = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    
    setRefreshInterval: (state, action) => {
      state.preferences.refreshInterval = action.payload;
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    
    // Reset user state
    resetUserState: (state) => {
      return initialState;
    },
  },
});

export const {
  setProfile,
  setStats,
  setPreferences,
  updatePreference,
  loadPreferences,
  setLoading,
  setError,
  clearError,
  startEditingProfile,
  stopEditingProfile,
  updateProfileForm,
  startChangingPassword,
  stopChangingPassword,
  updatePasswordForm,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
  setSettings,
  updateSetting,
  setTheme,
  setCurrency,
  setLanguage,
  setDashboardLayout,
  setAutoRefresh,
  setRefreshInterval,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer; 