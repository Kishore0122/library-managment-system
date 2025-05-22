// Script to clean up popup state on page refresh
(function() {
  try {
    // Check if user has explicitly logged out
    const logoutTimestamp = localStorage.getItem('logout');
    if (logoutTimestamp) {
      // User has logged out, don't interfere with logout state
      console.log('[CLEANUP] Detected logout state, not clearing any state');
      return;
    }
    
    // Clear only popup related data, preserve authentication
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