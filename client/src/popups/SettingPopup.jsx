import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAllPopups } from '../store/slices/popUpSlice';
import { FaTimes } from "react-icons/fa";

const SettingPopup = () => {
  const dispatch = useDispatch();
  const showPopup = useSelector((state) => state.popup.settingPopup);
  
  // Reset popup on component mount to prevent showing after refresh
  useEffect(() => {
    dispatch(resetAllPopups());
    
    return () => {
      dispatch(resetAllPopups());
    };
  }, [dispatch]);
  
  if (!showPopup) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => dispatch(resetAllPopups())}
        >
          <FaTimes />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
        
        {/* Add your settings form here */}
        <div className="text-center py-4">
          <p className="text-gray-600">Settings functionality will be implemented soon.</p>
        </div>
      </div>
    </div>
  );
};

export default SettingPopup;
