import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api/crypto',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery,
  tagTypes: ['Crypto'],
  endpoints: (builder) => ({
    // Get Cryptocurrencies List
    getCryptocurrencies: builder.query({
      query: ({ vsCurrency = 'usd', perPage = 100, page = 1, order = 'market_cap_desc' } = {}) => 
        `/coins?vs_currency=${vsCurrency}&per_page=${perPage}&page=${page}&order=${order}`,
      providesTags: ['Crypto'],
    }),
    
    // Get Coin Details
    getCoinDetails: builder.query({
      query: (coinId) => `/coin/${coinId}`,
      providesTags: (result, error, coinId) => [{ type: 'Crypto', id: coinId }],
    }),
    
    // Get Coin Price History
    getCoinHistory: builder.query({
      query: ({ coinId, vsCurrency = 'usd', days = 30, interval = 'daily' } = {}) => 
        `/coin/${coinId}/history?vs_currency=${vsCurrency}&days=${days}&interval=${interval}`,
      providesTags: (result, error, { coinId }) => [{ type: 'Crypto', id: `${coinId}-history` }],
    }),
    
    // Get Current Prices
    getCurrentPrices: builder.query({
      query: ({ 
        ids, 
        vsCurrencies = 'usd', 
        includeMarketCap = false, 
        include24hrVol = false, 
        include24hrChange = false 
      }) => {
        const params = new URLSearchParams({
          ids,
          vs_currencies: vsCurrencies,
          include_market_cap: includeMarketCap,
          include_24hr_vol: include24hrVol,
          include_24hr_change: include24hrChange,
        });
        return `/prices?${params.toString()}`;
      },
      providesTags: ['Crypto'],
    }),
    
    // Get Trending Coins
    getTrendingCoins: builder.query({
      query: () => '/trending',
      providesTags: ['Crypto'],
    }),
    
    // Get Global Market Data
    getGlobalMarketData: builder.query({
      query: () => '/global',
      providesTags: ['Crypto'],
    }),
    
    // Get Exchanges
    getExchanges: builder.query({
      query: ({ perPage = 50 } = {}) => `/exchanges?per_page=${perPage}`,
      providesTags: ['Crypto'],
    }),
  }),
});

export const {
  useGetCryptocurrenciesQuery,
  useGetCoinDetailsQuery,
  useGetCoinHistoryQuery,
  useGetCurrentPricesQuery,
  useGetTrendingCoinsQuery,
  useGetGlobalMarketDataQuery,
  useGetExchangesQuery,
} = cryptoApi; 