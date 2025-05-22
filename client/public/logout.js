// Script to clean up popup state on page refresh
(function() {
  try {
    // Don't clear authentication data
    // localStorage.removeItem('user');
    // localStorage.removeItem('authenticated');
    
    // Clear any popup related data
    localStorage.removeItem('popupState');
    localStorage.removeItem('addNewAdminPopup');
    localStorage.removeItem('settingPopup');
    localStorage.removeItem('addNewBookPopup');
    localStorage.removeItem('editBookPopup');
    
    console.log('[CLEANUP] Cleared popup state on page load');
  } catch (error) {
    console.error('[CLEANUP] Error during cleanup:', error);
  }
})(); 