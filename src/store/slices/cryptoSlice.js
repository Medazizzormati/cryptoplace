import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Currency settings
  currency: localStorage.getItem('currency') || 'USD',
  
  // Crypto data
  allCrypto: [],
  displayCrypto: [],
  
  // Market data
  marketData: null,
  
  // Filters and search
  searchTerm: '',
  sortBy: 'market_cap',
  sortOrder: 'desc',
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 10,
  
  // Loading states
  loading: false,
  error: null,
  
  // Favorites
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  
  // Chart settings
  chartTimeframe: '7d',
  chartType: 'price',
};

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    // Set currency
    setCurrency: (state, action) => {
      state.currency = action.payload;
      localStorage.setItem('currency', action.payload);
    },
    
    // Set crypto data
    setAllCrypto: (state, action) => {
      state.allCrypto = action.payload;
      state.displayCrypto = action.payload;
    },
    
    // Set market data
    setMarketData: (state, action) => {
      state.marketData = action.payload;
    },
    
    // Set search term
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    
    // Set sorting
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    
    // Set pagination
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when changing items per page
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
    
    // Favorites management
    addToFavorites: (state, action) => {
      const coinId = action.payload;
      if (!state.favorites.includes(coinId)) {
        state.favorites.push(coinId);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    
    removeFromFavorites: (state, action) => {
      const coinId = action.payload;
      state.favorites = state.favorites.filter(id => id !== coinId);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    
    // Chart settings
    setChartTimeframe: (state, action) => {
      state.chartTimeframe = action.payload;
    },
    
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    
    // Filter display crypto
    filterDisplayCrypto: (state) => {
      let filtered = [...state.allCrypto];
      
      // Apply search filter
      if (state.searchTerm) {
        filtered = filtered.filter(crypto =>
          crypto.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        let aValue = a[state.sortBy];
        let bValue = b[state.sortBy];
        
        // Handle null/undefined values
        if (aValue === null || aValue === undefined) aValue = 0;
        if (bValue === null || bValue === undefined) bValue = 0;
        
        if (state.sortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      state.displayCrypto = filtered;
    },
    
    // Get paginated crypto
    getPaginatedCrypto: (state) => {
      const startIndex = (state.currentPage - 1) * state.itemsPerPage;
      const endIndex = startIndex + state.itemsPerPage;
      return state.displayCrypto.slice(startIndex, endIndex);
    },
    
    // Reset filters
    resetFilters: (state) => {
      state.searchTerm = '';
      state.sortBy = 'market_cap';
      state.sortOrder = 'desc';
      state.currentPage = 1;
      state.displayCrypto = state.allCrypto;
    },
  },
});

export const {
  setCurrency,
  setAllCrypto,
  setMarketData,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setItemsPerPage,
  setLoading,
  setError,
  clearError,
  addToFavorites,
  removeFromFavorites,
  setChartTimeframe,
  setChartType,
  filterDisplayCrypto,
  getPaginatedCrypto,
  resetFilters,
} = cryptoSlice.actions;

export default cryptoSlice.reducer; 