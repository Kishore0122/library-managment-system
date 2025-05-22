import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AddBookPopup from '../popups/AddBookPopup';
import AddNewAdmin from '../popups/AddNewAdmin';
import SettingPopup from '../popups/SettingPopup';
import EditBookPopup from '../popups/EditBookPopup';
import { resetAllPopups } from '../store/slices/popUpSlice';

const PopupContainer = () => {
  const dispatch = useDispatch();
  
  // Add event listener for ESC key to close all popups
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        dispatch(resetAllPopups());
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [dispatch]);
  
  return (
    <>
      <AddBookPopup />
      <AddNewAdmin />
      <SettingPopup />
      <EditBookPopup />
    </>
  );
};

export default PopupContainer; 