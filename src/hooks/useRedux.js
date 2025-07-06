import { useSelector, useDispatch } from 'react-redux';
import { 
  useLoginMutation, 
  useSignupMutation, 
  useLogoutMutation 
} from '../store/api/authApi';
import { 
  useGetCryptocurrenciesQuery,
  useGetCoinDetailsQuery,
  useGetCoinHistoryQuery 
} from '../store/api/cryptoApi';
import {
  useGetUserPortfolioQuery,
  useGetPortfolioSummaryQuery,
  useBuyCryptocurrencyMutation,
  useSellCryptocurrencyMutation
} from '../store/api/portfolioApi';
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation
} from '../store/api/userApi';

// Custom hooks for easy Redux usage
export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();
  const [logout] = useLogoutMutation();
  
  return {
    ...auth,
    login,
    signup,
    logout,
    dispatch,
  };
};

export const useCrypto = () => {
  const dispatch = useDispatch();
  const crypto = useSelector(state => state.crypto);
  
  return {
    ...crypto,
    dispatch,
  };
};

export const usePortfolio = () => {
  const dispatch = useDispatch();
  const portfolio = useSelector(state => state.portfolio);
  
  const [buyCrypto] = useBuyCryptocurrencyMutation();
  const [sellCrypto] = useSellCryptocurrencyMutation();
  
  return {
    ...portfolio,
    buyCrypto,
    sellCrypto,
    dispatch,
  };
};

export const useUser = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  
  const [updateProfile] = useUpdateUserProfileMutation();
  
  return {
    ...user,
    updateProfile,
    dispatch,
  };
};

// Specific data hooks
export const useCryptoData = (options = {}) => {
  return useGetCryptocurrenciesQuery(options);
};

export const useCoinDetails = (coinId) => {
  return useGetCoinDetailsQuery(coinId, {
    skip: !coinId,
  });
};

export const useCoinHistory = (coinId, options = {}) => {
  return useGetCoinHistoryQuery(
    { coinId, ...options },
    { skip: !coinId }
  );
};

export const usePortfolioData = () => {
  const auth = useAuth();
  
  const portfolioQuery = useGetUserPortfolioQuery(undefined, {
    skip: !auth.isAuthenticated,
  });
  
  const summaryQuery = useGetPortfolioSummaryQuery(undefined, {
    skip: !auth.isAuthenticated,
  });
  
  return {
    portfolio: portfolioQuery,
    summary: summaryQuery,
  };
};

export const useUserProfile = () => {
  const auth = useAuth();
  
  return useGetUserProfileQuery(undefined, {
    skip: !auth.isAuthenticated,
  });
}; 