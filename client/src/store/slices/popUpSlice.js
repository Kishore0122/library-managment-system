import { createSlice } from "@reduxjs/toolkit";

// Default initial state - all popups closed
const initialState = {
  addNewAdminPopup: false,
  settingPopup: false,
  addNewBookPopup: false,
  editBookPopup: false,
  dismissAdminPopup: false,
  selectedBook: null,
  actionMessage: null,
  actionType: null
};

// Helper to clear any popup-related items in localStorage
const clearPopupStorage = () => {
  // Remove any potential localStorage items related to popup state
  try {
    localStorage.removeItem('popupState');
    localStorage.removeItem('addNewAdminPopup');
    localStorage.removeItem('settingPopup');
    localStorage.removeItem('addNewBookPopup');
    localStorage.removeItem('editBookPopup');
    localStorage.removeItem('dismissAdminPopup');
  } catch (error) {
    console.error('Error clearing popup storage:', error);
  }
};

// Clear popups immediately on page load
clearPopupStorage();

const popupSlice = createSlice({
  name: "popup",
  initialState,
  reducers: {
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddNewBookPopup(state) {
      state.addNewBookPopup = !state.addNewBookPopup;
    },
    toggleEditBookPopup(state) {
      state.editBookPopup = !state.editBookPopup;
    },
    toggleDismissAdminPopup(state) {
      state.dismissAdminPopup = !state.dismissAdminPopup;
    },
    setSelectedBook(state, action) {
      state.selectedBook = action.payload;
    },
    resetSelectedBook(state) {
      state.selectedBook = null;
    },
    setActionMessage(state, action) {
      state.actionMessage = action.payload.message;
      state.actionType = action.payload.type;
    },
    clearActionMessage(state) {
      state.actionMessage = null;
      state.actionType = null;
    },
    // Add a new reducer to reset all popups
    resetAllPopups(state) {
      // Clear any popup state in localStorage
      clearPopupStorage();
      
      // Reset all popup states but keep any action messages
      const { actionMessage, actionType } = state;
      return {
        ...initialState,
        actionMessage,
        actionType
      };
    }
  }
});

export const {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
  toggleAddNewBookPopup,
  toggleEditBookPopup,
  toggleDismissAdminPopup,
  setSelectedBook,
  resetSelectedBook,
  setActionMessage,
  clearActionMessage,
  resetAllPopups
} = popupSlice.actions;

export const showActionMessage = (message, type = 'success') => (dispatch) => {
  dispatch(setActionMessage({ message, type }));
  
  setTimeout(() => {
    dispatch(clearActionMessage());
  }, 5000);
};

export default popupSlice.reducer;
