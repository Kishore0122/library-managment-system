import api from "../api/axios";

// Function to handle auto logout when closing the browser/tab
export const setupAutoLogout = () => {
  // This flag helps us distinguish between a page refresh and a tab close
  let isRefreshing = false;
  
  // Handle page refreshes
  const handlePageHide = (event) => {
    // For page refresh, the persisted flag is true
    // For tab close, the persisted flag is false
    if (event.persisted) {
      isRefreshing = true;
    }
  };
  
  // Handle before unload event
  const handleBeforeUnload = (event) => {
    // If it's a refresh, don't logout
    if (isRefreshing) {
      isRefreshing = false;
      return;
    }
    
    // Otherwise, it's likely a tab/browser close, so logout
    try {
      console.log("Tab/browser closing, logging out...");
      
      // Synchronous API request to logout
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://localhost:4000/api/v1/auth/logout', false); // false makes it synchronous
      xhr.withCredentials = true;
      xhr.send();
      
      // Clear user data from localStorage
      localStorage.removeItem('user');
      localStorage.setItem('logout', Date.now().toString());
    } catch (error) {
      console.error("Auto logout error:", error);
    }
  };
  
  // Add event listeners
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('pagehide', handlePageHide);
  
  // Store the handlers so we can remove them later
  window._autoLogoutHandlers = {
    beforeunload: handleBeforeUnload,
    pagehide: handlePageHide
  };
};

// Function to clear the auto logout listeners
export const clearAutoLogout = () => {
  if (window._autoLogoutHandlers) {
    window.removeEventListener('beforeunload', window._autoLogoutHandlers.beforeunload);
    window.removeEventListener('pagehide', window._autoLogoutHandlers.pagehide);
    window._autoLogoutHandlers = null;
  }
};

// Force logout on page refresh/load (browser's back button or direct URL access)
export const forceLogoutOnLoad = () => {
  // Set a flag to indicate that the user needs to login again
  localStorage.setItem('requireLogin', 'true');
  // Clear existing user data
  localStorage.removeItem('user');
}; 