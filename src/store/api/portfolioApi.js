import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api/portfolio',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const portfolioApi = createApi({
  reducerPath: 'portfolioApi',
  baseQuery,
  tagTypes: ['Portfolio', 'Transaction'],
  endpoints: (builder) => ({
    // Get User Portfolio
    getUserPortfolio: builder.query({
      query: () => '/',
      providesTags: ['Portfolio'],
    }),
    
    // Get Portfolio Summary
    getPortfolioSummary: builder.query({
      query: () => '/summary',
      providesTags: ['Portfolio'],
    }),
    
    // Get User Transactions
    getUserTransactions: builder.query({
      query: () => '/transactions',
      providesTags: ['Transaction'],
    }),
    
    // Buy Cryptocurrency
    buyCryptocurrency: builder.mutation({
      query: (transactionData) => ({
        url: '/buy',
        method: 'POST',
        body: transactionData,
      }),
      invalidatesTags: ['Portfolio', 'Transaction'],
    }),
    
    // Sell Cryptocurrency
    sellCryptocurrency: builder.mutation({
      query: (transactionData) => ({
        url: '/sell',
        method: 'POST',
        body: transactionData,
      }),
      invalidatesTags: ['Portfolio', 'Transaction'],
    }),
    
    // Get Portfolio Performance
    getPortfolioPerformance: builder.query({
      query: () => '/performance',
      providesTags: ['Portfolio'],
    }),
    
    // Get Specific Holding
    getHolding: builder.query({
      query: (symbol) => `/holdings/${symbol}`,
      providesTags: (result, error, symbol) => [{ type: 'Portfolio', id: symbol }],
    }),
  }),
});

export const {
  useGetUserPortfolioQuery,
  useGetPortfolioSummaryQuery,
  useGetUserTransactionsQuery,
  useBuyCryptocurrencyMutation,
  useSellCryptocurrencyMutation,
  useGetPortfolioPerformanceQuery,
  useGetHoldingQuery,
} = portfolioApi; 