import { toast } from 'react-toastify';
import { showActionMessage } from '../store/slices/popUpSlice';

/**
 * Handles API requests with proper error handling and notifications
 * 
 * @param {Function} apiCall - The API call function to execute
 * @param {Object} options - Configuration options
 * @param {Function} dispatch - Redux dispatch function
 * @returns {Promise<Object>} The API response data
 */
export const handleApiRequest = async (apiCall, options = {}, dispatch) => {
  const {
    loadingMessage = 'Processing request...',
    successMessage = 'Operation completed successfully',
    errorMessage = 'Operation failed',
    showToast = true,
    persistMessage = true
  } = options;
  
  try {
    // Show loading toast if needed
    let toastId;
    if (showToast) {
      toastId = toast.loading(loadingMessage);
    }
    
    // Execute the API call
    const response = await apiCall();
    
    // Update the toast with success message
    if (showToast) {
      toast.update(toastId, { 
        render: successMessage, 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });
    }
    
    // Persist success message for after page refresh if needed
    if (persistMessage && dispatch) {
      dispatch(showActionMessage(successMessage));
    }
    
    return response.data;
  } catch (error) {
    // Extract error message
    const errorMsg = error.response?.data?.message || errorMessage;
    
    // Show error toast
    if (showToast) {
      toast.error(errorMsg);
    }
    
    // Persist error message if needed
    if (persistMessage && dispatch) {
      dispatch(showActionMessage(errorMsg, 'error'));
    }
    
    throw error;
  }
}; 