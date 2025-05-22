import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OTP from "./pages/OTP.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loadUser, logout } from "./store/slices/authSlice.js";
import { resetAllPopups } from "./store/slices/popUpSlice.js";
import Loader from "./components/Loader.jsx";
import { setupAutoLogout, clearAutoLogout } from "./utils/autoLogout.js";

// Clear any user data on initial load to ensure clean state
// localStorage.removeItem('user');

const App = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { Loading, authenticated } = useSelector(state => state.auth);

  // Function to check if we have a stored user
  const checkStoredAuth = () => {
    try {
      const userData = localStorage.getItem('user');
      return !!userData; // Return true if we have user data
    } catch (error) {
      return false;
    }
  };

  // Set initial authenticated state based on localStorage
  const [hasStoredAuth] = useState(checkStoredAuth());

  useEffect(() => {
    // Reset all popups whenever the app loads/refreshes
    dispatch(resetAllPopups());
    
    const fetchUser = async () => {
      try {
        // Check if we have a session either through cookies or local authentication
        await dispatch(loadUser());
        
        // Set up auto logout when authenticated
        if (authenticated || hasStoredAuth) {
          setupAutoLogout();
        }
      } catch (error) {
        console.error("Error loading user:", error);
        // If there's an error, check if we have a stored user but respect logout state
        const logoutTimestamp = localStorage.getItem('logout');
        if (logoutTimestamp) {
          // User has explicitly logged out, don't use stored data
          localStorage.removeItem('user');
          setIsLoading(false);
          return;
        }
        // Otherwise continue with stored auth if available
        if (hasStoredAuth) {
          setupAutoLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
    
    // Set up event listener for storage changes (for multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === 'logout') {
        // If logout was triggered in another tab, clear user data and redirect
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Setup auto logout for browser/tab close events
    if (authenticated || hasStoredAuth) {
      setupAutoLogout();
    }
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearAutoLogout();
    };
  }, [dispatch, authenticated, hasStoredAuth]);

  // Use either redux authenticated state or localStorage backup
  const isAuthenticated = authenticated || hasStoredAuth;

  return (
    <Router>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Routes>
            {/* Use the combined authentication state */}
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/otp-verification/:email" element={<OTP />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            {/* Catch all route to redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </>
      )}
    </Router>
  );
};

export default App;
