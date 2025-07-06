import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8080/api/users',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Get User Profile
    getUserProfile: builder.query({
      query: () => '/profile',
      providesTags: ['User'],
    }),
    
    // Update User Profile
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: '/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Change Password
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/password',
        method: 'PUT',
        body: passwordData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Get User Statistics
    getUserStats: builder.query({
      query: () => '/stats',
      providesTags: ['User'],
    }),
    
    // Delete User Account
    deleteUserAccount: builder.mutation({
      query: (passwordData) => ({
        url: '/account',
        method: 'DELETE',
        body: passwordData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Get User Preferences
    getUserPreferences: builder.query({
      query: () => '/preferences',
      providesTags: ['User'],
    }),
    
    // Update User Preferences
    updateUserPreferences: builder.mutation({
      query: (preferences) => ({
        url: '/preferences',
        method: 'PUT',
        body: preferences,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetUserStatsQuery,
  useDeleteUserAccountMutation,
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
} = userApi; 