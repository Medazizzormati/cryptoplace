import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Portfolio data
  holdings: [],
  summary: {
    totalValue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitPercentage: 0,
    totalHoldings: 0,
  },
  
  // Transactions
  transactions: [],
  
  // Performance data
  performance: {
    totalInvested: 0,
    totalReturns: 0,
    totalTransactions: 0,
  },
  
  // UI states
  loading: false,
  error: null,
  
  // Filters
  transactionFilter: 'all', // 'all', 'buy', 'sell'
  holdingsSortBy: 'value', // 'value', 'amount', 'profit'
  holdingsSortOrder: 'desc',
  
  // Modal states
  buyModalOpen: false,
  sellModalOpen: false,
  selectedCoin: null,
  
  // Transaction form
  transactionForm: {
    symbol: '',
    amount: '',
    price: '',
    type: 'buy',
  },
  
  // Alerts
  alerts: [],
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    // Set portfolio data
    setHoldings: (state, action) => {
      state.holdings = action.payload;
    },
    
    setSummary: (state, action) => {
      state.summary = action.payload;
    },
    
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    
    setPerformance: (state, action) => {
      state.performance = action.payload;
    },
    
    // Add new transaction
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
    },
    
    // Update holding
    updateHolding: (state, action) => {
      const { symbol, data } = action.payload;
      const index = state.holdings.findIndex(h => h.symbol === symbol);
      if (index !== -1) {
        state.holdings[index] = { ...state.holdings[index], ...data };
      }
    },
    
    // Add new holding
    addHolding: (state, action) => {
      state.holdings.push(action.payload);
    },
    
    // Remove holding
    removeHolding: (state, action) => {
      const symbol = action.payload;
      state.holdings = state.holdings.filter(h => h.symbol !== symbol);
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
    
    // Filters
    setTransactionFilter: (state, action) => {
      state.transactionFilter = action.payload;
    },
    
    setHoldingsSortBy: (state, action) => {
      state.holdingsSortBy = action.payload;
    },
    
    setHoldingsSortOrder: (state, action) => {
      state.holdingsSortOrder = action.payload;
    },
    
    // Modal states
    openBuyModal: (state, action) => {
      state.buyModalOpen = true;
      state.selectedCoin = action.payload;
      state.transactionForm = {
        symbol: action.payload?.symbol || '',
        amount: '',
        price: action.payload?.current_price || '',
        type: 'buy',
      };
    },
    
    closeBuyModal: (state) => {
      state.buyModalOpen = false;
      state.selectedCoin = null;
      state.transactionForm = {
        symbol: '',
        amount: '',
        price: '',
        type: 'buy',
      };
    },
    
    openSellModal: (state, action) => {
      state.sellModalOpen = true;
      state.selectedCoin = action.payload;
      state.transactionForm = {
        symbol: action.payload?.symbol || '',
        amount: '',
        price: action.payload?.current_price || '',
        type: 'sell',
      };
    },
    
    closeSellModal: (state) => {
      state.sellModalOpen = false;
      state.selectedCoin = null;
      state.transactionForm = {
        symbol: '',
        amount: '',
        price: '',
        type: 'sell',
      };
    },
    
    // Transaction form
    updateTransactionForm: (state, action) => {
      state.transactionForm = { ...state.transactionForm, ...action.payload };
    },
    
    resetTransactionForm: (state) => {
      state.transactionForm = {
        symbol: '',
        amount: '',
        price: '',
        type: 'buy',
      };
    },
    
    // Alerts
    addAlert: (state, action) => {
      state.alerts.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(alert => alert.id !== action.payload);
    },
    
    clearAllAlerts: (state) => {
      state.alerts = [];
    },
    
    // Sort holdings
    sortHoldings: (state) => {
      state.holdings.sort((a, b) => {
        let aValue = a[state.holdingsSortBy];
        let bValue = b[state.holdingsSortBy];
        
        // Handle calculated values
        if (state.holdingsSortBy === 'value') {
          aValue = (a.amount || 0) * (a.averagePrice || 0);
          bValue = (b.amount || 0) * (b.averagePrice || 0);
        } else if (state.holdingsSortBy === 'profit') {
          const aCurrentValue = (a.amount || 0) * (a.currentPrice || a.averagePrice || 0);
          const aCost = (a.amount || 0) * (a.averagePrice || 0);
          aValue = aCurrentValue - aCost;
          
          const bCurrentValue = (b.amount || 0) * (b.currentPrice || b.averagePrice || 0);
          const bCost = (b.amount || 0) * (b.averagePrice || 0);
          bValue = bCurrentValue - bCost;
        }
        
        if (state.holdingsSortOrder === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },
    
    // Get filtered transactions
    getFilteredTransactions: (state) => {
      if (state.transactionFilter === 'all') {
        return state.transactions;
      }
      return state.transactions.filter(transaction => 
        transaction.type.toLowerCase() === state.transactionFilter
      );
    },
  },
});

export const {
  setHoldings,
  setSummary,
  setTransactions,
  setPerformance,
  addTransaction,
  updateHolding,
  addHolding,
  removeHolding,
  setLoading,
  setError,
  clearError,
  setTransactionFilter,
  setHoldingsSortBy,
  setHoldingsSortOrder,
  openBuyModal,
  closeBuyModal,
  openSellModal,
  closeSellModal,
  updateTransactionForm,
  resetTransactionForm,
  addAlert,
  removeAlert,
  clearAllAlerts,
  sortHoldings,
  getFilteredTransactions,
} = portfolioSlice.actions;

export default portfolioSlice.reducer; 