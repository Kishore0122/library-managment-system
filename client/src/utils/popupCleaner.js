/**
 * This utility provides functions to ensure all popups are closed,
 * particularly after page refreshes
 */

// Clear any popup-related localStorage items
export const clearPopupStorage = () => {
  try {
    // Clear all known popup-related localStorage items
    localStorage.removeItem('popupState');
    localStorage.removeItem('addNewAdminPopup');
    localStorage.removeItem('settingPopup');
    localStorage.removeItem('addNewBookPopup');
    localStorage.removeItem('editBookPopup');
    localStorage.removeItem('selectedBook');
    
    // Also clear any unknown popup-related items by checking all keys
    Object.keys(localStorage).forEach(key => {
      if (key.toLowerCase().includes('popup') || key.toLowerCase().includes('modal')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('Cleared all popup-related storage on page load');
  } catch (error) {
    console.error('Error clearing popup storage:', error);
  }
};

// Force-close any modals that might be in the DOM
export const forceCloseModals = () => {
  try {
    // Look for common modal elements and force-close them
    const modalBackdrops = document.querySelectorAll('.modal-backdrop, .fixed.inset-0');
    modalBackdrops.forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    
    // Remove any open modal classes on the body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
    
    console.log('Force-closed any modal elements in the DOM');
  } catch (error) {
    console.error('Error force-closing modals:', error);
  }
};

// Initialize on script load
(function initializePopupCleaner() {
  // Clear localStorage popups on page load
  clearPopupStorage();
  
  // Set up a handler for page visibility changes (when user navigates back to the page)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      clearPopupStorage();
      forceCloseModals();
    }
  });
  
  // Handle after load to ensure DOM is ready
  window.addEventListener('load', forceCloseModals);
})();

export default {
  clearPopupStorage,
  forceCloseModals
}; 