// src/hooks/useSubscribe.js
import { useState } from 'react';
import axios from 'axios';
import baseURL from '../utils/baseURL';

export const useSubscribe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const subscribe = async (email, source = 'newsletter') => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Making request to:', `${baseURL}/api/subscribers/subscribe`);
      
      const response = await axios.post(
        `${baseURL}/api/subscribers/subscribe`,
        { email, source },
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Subscription response:', response.data);
      setSuccess(true);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Full error object:', err);
      
      let errorMessage = 'Failed to subscribe. Please try again.';
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (err.response) {
        // Server responded with error status
        const serverError = err.response.data;
        errorMessage = serverError?.message || `Server error: ${err.response.status}`;
        
        // Handle specific error cases
        if (err.response.status === 400) {
          errorMessage = serverError.message || 'Invalid email address or already subscribed.';
        } else if (err.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received. Request:', err.request);
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        // Something else happened
        errorMessage = err.message || 'An unexpected error occurred.';
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    subscribe,
    loading,
    error,
    success,
    reset
  };
};