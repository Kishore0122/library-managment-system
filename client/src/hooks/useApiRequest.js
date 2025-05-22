import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { showActionMessage } from '../store/slices/popUpSlice';
import api from '../api/axios';

/**
 * Custom hook for making API requests with state management
 * 
 * @returns {Object} Object containing loading state, error state, and request function
 */
const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  /**
   * Make an API request with proper error handling
   * 
   * @param {Function} requestFn - Function that returns a promise (e.g., () => api.get('/endpoint'))
   * @param {Object} options - Options for the request
   * @param {String} options.successMessage - Message to show on success
   * @param {String} options.errorMessage - Default error message
   * @param {Boolean} options.showToast - Whether to show toast notifications
   * @param {Boolean} options.persistMessage - Whether to persist message in Redux state
   * @param {Function} options.onSuccess - Callback to run on success
   * @param {Function} options.onError - Callback to run on error
   * @returns {Promise} Result of the API request
   */
  const makeRequest = async (requestFn, options = {}) => {
    const {
      successMessage = 'Operation successful',
      errorMessage = 'Operation failed',
      showToast = true,
      persistMessage = true,
      onSuccess,
      onError
    } = options;

    setLoading(true);
    setError(null);
    
    try {
      const response = await requestFn();
      
      // Show success message if needed
      if (showToast) {
        toast.success(successMessage);
      }
      
      // Store message in Redux for persistence
      if (persistMessage) {
        dispatch(showActionMessage(successMessage));
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      setLoading(false);
      return response.data;
    } catch (error) {
      // Extract error message
      const errorMsg = error.response?.data?.message || errorMessage;
      
      // Set error state
      setError(errorMsg);
      
      // Show error toast if needed
      if (showToast) {
        toast.error(errorMsg);
      }
      
      // Store error message in Redux for persistence
      if (persistMessage) {
        dispatch(showActionMessage(errorMsg, 'error'));
      }
      
      // Call error callback if provided
      if (onError) {
        onError(error);
      }
      
      setLoading(false);
      throw error;
    }
  };

  return {
    loading,
    error,
    makeRequest
  };
};

export default useApiRequest; 