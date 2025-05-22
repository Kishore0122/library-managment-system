import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearActionMessage } from '../store/slices/popUpSlice';
import { FaCheck, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ActionNotification = () => {
  const dispatch = useDispatch();
  const { actionMessage, actionType } = useSelector(state => state.popup);
  
  useEffect(() => {
    // Auto dismiss after 5 seconds
    if (actionMessage) {
      const timer = setTimeout(() => {
        dispatch(clearActionMessage());
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [actionMessage, dispatch]);
  
  if (!actionMessage) return null;
  
  const bgColor = actionType === 'error' ? 'bg-red-100' : 'bg-green-100';
  const textColor = actionType === 'error' ? 'text-red-800' : 'text-green-800';
  const borderColor = actionType === 'error' ? 'border-red-400' : 'border-green-400';
  const icon = actionType === 'error' ? <FaExclamationTriangle /> : <FaCheck />;
  
  return (
    <div className={`fixed top-5 right-5 z-50 p-4 rounded-md ${bgColor} border ${borderColor} flex items-center shadow-lg max-w-md`}>
      <div className={`mr-3 ${textColor}`}>
        {icon}
      </div>
      <div className={`mr-2 ${textColor} font-medium`}>
        {actionMessage}
      </div>
      <button 
        onClick={() => dispatch(clearActionMessage())}
        className={`ml-auto ${textColor} hover:text-gray-500`}
      >
        <FaTimes />
      </button>
    </div>
  );
};

export default ActionNotification; 