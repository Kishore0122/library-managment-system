import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

// Helper function to check if we have any stored user info
const getStoredUserData = () => {
    try {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Don't remove user data on parsing error
        // localStorage.removeItem('user'); 
        return null;
    }
};

// Force logout on development to ensure clean state
const forceLogoutOnDev = () => {
    try {
        localStorage.removeItem('user');
        console.log('Forced logout on dev environment');
    } catch (error) {
        console.error('Error forcing logout:', error);
    }
    return null;
};

// Check if we have a stored session, force logout on refresh in dev
// const storedUser = process.env.NODE_ENV === 'development' ? forceLogoutOnDev() : getStoredUserData();
const storedUser = getStoredUserData(); // Get stored user data from localStorage

const authslice = createSlice({
    name: "auth",
    initialState: {
        user: storedUser,
        Loading: false,
        message: null,
        error: null,
        authenticated: false, // Always start as not authenticated
        pendingVerification: null,
        // New state to track action notifications
        actionNotification: null,
    },
    reducers: {
        registerrequest(state) {
            state.Loading = true;
            state.message = null;
            state.error = null;
            state.pendingVerification = null;
        },
        registerSuccess(state, action) {
            state.Loading = false;
            state.message = action.payload.message;
            state.pendingVerification = action.payload.email;
        },
        registerFailure(state, action) {
            state.Loading = false;
            state.error = action.payload;
            state.pendingVerification = null;
        },
        loginRequest(state) {
            state.Loading = true;
            state.message = null;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.Loading = false;
            state.user = action.payload.user;
            state.authenticated = true;
            state.message = action.payload.message;
            
            // Store user data in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loginFailure(state, action) {
            state.Loading = false;
            state.error = action.payload;
        },
        logoutRequest(state) {
            state.Loading = true;
        },
        logoutSuccess(state, action) {
            state.Loading = false;
            state.user = null;
            state.authenticated = false;
            state.message = action.payload.message;
            
            // Clear stored user data
            localStorage.removeItem('user');
            // Trigger logout event for other tabs
            localStorage.setItem('logout', Date.now().toString());
        },
        logoutFailure(state, action) {
            state.Loading = false;
            state.error = action.payload;
        },
        otpverificationrequest(state) {
            state.Loading = true;
            state.message = null;
            state.error = null;
        },
        otpverificationSuccess(state, action) {
            state.Loading = false;
            state.message = action.payload.message;
            state.authenticated = true;
            state.user = action.payload.user;
            state.pendingVerification = null;
            
            // Store user data in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        otpverificationFailure(state, action) {
            state.Loading = false;
            state.error = action.payload;
        },
        clearPendingVerification(state) {
            state.pendingVerification = null;
        },
        forgotPasswordRequest(state) {
            state.Loading = true;
            state.message = null;
            state.error = null;
        },
        forgotPasswordSuccess(state, action) {
            state.Loading = false;
            state.message = action.payload.message;
        },
        forgotPasswordFailure(state, action) {
            state.Loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest(state) {
            state.Loading = true;
            state.message = null;
            state.error = null;
        },
        resetPasswordSuccess(state, action) {
            state.Loading = false;
            state.message = action.payload.message;
        },
        resetPasswordFailure(state, action) {
            state.Loading = false;
            state.error = action.payload;
        },
        loadUserRequest(state) {
            state.Loading = true;
            state.error = null;
        },
        loadUserSuccess(state, action) {
            state.Loading = false;
            state.user = action.payload.user;
            state.authenticated = true;
            
            // Store updated user data
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        loadUserFailure(state, action) {
            state.Loading = false;
            state.error = action.payload;
            
            // Don't clear authentication on load failure
            // This way, if API is down, user can still use cached data
            // state.user = null;
            // state.authenticated = false;
            
            // Don't clear stored user data on authentication failure
            // localStorage.removeItem('user');
        },
        resetAuthSlice(state) {
            state.message = null;
            state.error = null;
        },
        // New reducer for action notifications
        setActionNotification(state, action) {
            state.actionNotification = action.payload;
        },
        clearActionNotification(state) {
            state.actionNotification = null;
        },
    }
});

// Action creators for authentication
export const login = (data) => async (dispatch) => {
    try {
        dispatch(authslice.actions.loginRequest());
        const response = await api.post("/auth/login", data);
        dispatch(authslice.actions.loginSuccess(response.data));
    } catch (error) {
        dispatch(authslice.actions.loginFailure(error.response?.data?.message || "An error occurred"));
    }
};

export const logout = () => async (dispatch) => {
    try {
        dispatch(authslice.actions.logoutRequest());
        const response = await api.get("/auth/logout");
        dispatch(authslice.actions.logoutSuccess(response.data));
        
        // Force redirect to login page
        window.location.href = '/login';
    } catch (error) {
        dispatch(authslice.actions.logoutFailure(error.response?.data?.message || "An error occurred"));
        
        // Even if API call fails, we should clear local storage and redirect
        localStorage.removeItem('user');
        localStorage.setItem('logout', Date.now().toString());
        window.location.href = '/login';
    }
};

export const register = (data) => async (dispatch) => {
    dispatch(authslice.actions.registerrequest());
    try {
        const response = await api.post("/auth/register", data);
        dispatch(authslice.actions.registerSuccess({
            ...response.data,
            email: data.email
        }));
    } catch (error) {
        console.error("Registration error:", error);
        dispatch(authslice.actions.registerFailure(
            error.response?.data?.message || 
            "Registration failed. Please try again later."
        ));
    }
};

export const otpverification = (email, otp) => async (dispatch) => {
    dispatch(authslice.actions.otpverificationrequest());
    try {
        const response = await api.post("/auth/verifyotp", { email, otp });
        dispatch(authslice.actions.otpverificationSuccess(response.data));
    } catch (error) {
        dispatch(authslice.actions.otpverificationFailure(error.response?.data?.message || "An error occurred"));
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    dispatch(authslice.actions.forgotPasswordRequest());
    try {
        const response = await api.post("/auth/password/forgot", { email });
        dispatch(authslice.actions.forgotPasswordSuccess(response.data));
    } catch (error) {
        dispatch(authslice.actions.forgotPasswordFailure(error.response?.data?.message || "An error occurred"));
    }
};

export const resetPassword = (token, password) => async (dispatch) => {
    dispatch(authslice.actions.resetPasswordRequest());
    try {
        const response = await api.put(`/auth/password/reset/${token}`, { password });
        dispatch(authslice.actions.resetPasswordSuccess(response.data));
    } catch (error) {
        dispatch(authslice.actions.resetPasswordFailure(error.response?.data?.message || "An error occurred"));
    }
};

// Load user on app initialization
export const loadUser = () => async (dispatch) => {
    try {
        dispatch(authslice.actions.loadUserRequest());
        const response = await api.get("/auth/me");
        
        // Only set as authenticated if response is successful and contains user data
        if (response.data?.success && response.data?.user) {
            dispatch(authslice.actions.loadUserSuccess(response.data));
            return response.data;
        } else {
            // If no user data from API but we have stored data, keep using the stored data
            const storedUser = getStoredUserData();
            if (storedUser) {
                console.log("Using stored user data instead of API response");
                dispatch(authslice.actions.loadUserSuccess({ user: storedUser }));
                return { user: storedUser };
            }
            
            // Only if we have neither API data nor stored data, trigger authentication failure
            throw new Error("No user data found");
        }
    } catch (error) {
        // If API fails but we have stored user data, keep the user logged in
        const storedUser = getStoredUserData();
        if (storedUser) {
            console.log("API error but using stored user data to maintain session");
            dispatch(authslice.actions.loadUserSuccess({ user: storedUser }));
            return { user: storedUser };
        }
        
        // Only if we have no stored data, report failure
        console.error("Authentication failed and no stored data available");
        dispatch(authslice.actions.loadUserFailure(error.response?.data?.message || "Failed to load user"));
        throw error;
    }
};

// Set action notification
export const setActionNotification = (message) => (dispatch) => {
    dispatch(authslice.actions.setActionNotification(message));
    // Auto clear after 5 seconds
    setTimeout(() => {
        dispatch(authslice.actions.clearActionNotification());
    }, 5000);
};

export const { resetAuthSlice, clearActionNotification } = authslice.actions;
export default authslice.reducer;

