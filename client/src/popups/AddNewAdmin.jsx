import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddNewAdminPopup, resetAllPopups } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { FaTimes, FaUpload, FaUser } from "react-icons/fa";
import { showActionMessage } from "../store/slices/popUpSlice";
import api from "../api/axios";

const AddNewAdmin = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const showPopup = useSelector((state) => state.popup.addNewAdminPopup);
  
  // Close the popup on component mount (page refresh) and component unmount
  useEffect(() => {
    // On component mount, make sure the popup is closed
    dispatch(resetAllPopups());
    
    // On component unmount, clean up by closing the popup
    return () => {
      dispatch(resetAllPopups());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 2) { // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file");
        return;
      }
      
      setProfileImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!profileImage) {
      toast.error("Please upload a profile image");
      return;
    }
    
    try {
      setLoading(true);
      
      // Create FormData to handle file upload
      const adminData = new FormData();
      adminData.append('name', formData.name);
      adminData.append('email', formData.email);
      adminData.append('password', formData.password);
      
      // Use 'profile' instead of 'profileImage' to match backend expectation
      adminData.append('profile', profileImage);
      
      const response = await api.post(
        "/user/add/new-admin",
        adminData,
        { 
          headers: {
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      if (response.data.success) {
        // Display success using toast immediately
        toast.success("New admin added successfully");
        
        // Also store action message in Redux for persistence after page refresh
        dispatch(showActionMessage("New admin has been added successfully"));
        
        // Close the popup
        dispatch(resetAllPopups());
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
        setProfileImage(null);
        setImagePreview(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to add new admin";
      toast.error(errorMessage);
      dispatch(showActionMessage(errorMessage, "error"));
    } finally {
      setLoading(false);
    }
  };

  // If no popup is showing, return null immediately
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
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Admin</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Profile Image Upload */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400 text-3xl" />
              )}
            </div>
            
            <label className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              <FaUpload className="mr-2" />
              <span>Upload Profile Image</span>
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG or GIF up to 2MB
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter full name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter email address"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter password"
              required
              minLength="6"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Confirm password"
              required
              minLength="6"
            />
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500 mr-4"
              onClick={() => dispatch(resetAllPopups())}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;
