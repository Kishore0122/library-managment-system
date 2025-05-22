import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showActionMessage, resetAllPopups } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import api from "../api/axios";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const showPopup = useSelector((state) => state.popup.addNewBookPopup);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    auther: "",
    description: "",
    charge: "",
    quantity: ""
  });

  // Reset popup on component mount to prevent showing after refresh
  useEffect(() => {
    dispatch(resetAllPopups());
    
    return () => {
      dispatch(resetAllPopups());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.auther || !formData.description || !formData.charge || !formData.quantity) {
      toast.error("All fields are required");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await api.post(
        "/books/admin/addbook",
        {
          title: formData.title,
          auther: formData.auther,
          description: formData.description,
          charge: Number(formData.charge),
          quantity: Number(formData.quantity)
        }
      );
      
      if (response.data.success) {
        // Show immediate success message
        toast.success("Book added successfully");
        
        // Store message for persistence after refresh
        dispatch(showActionMessage("Book added successfully. You can view it in the book list."));
        
        // Close the popup
        handleClose();
      }
    } catch (error) {
      console.error("Error adding book:", error);
      const errorMessage = error.response?.data?.message || "Failed to add book";
      toast.error(errorMessage);
      dispatch(showActionMessage(errorMessage, "error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(resetAllPopups());
    setFormData({
      title: "",
      auther: "",
      description: "",
      charge: "",
      quantity: ""
    });
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Book</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div>
              <label htmlFor="auther" className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                id="auther"
                name="auther"
                value={formData.auther}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div>
              <label htmlFor="charge" className="block text-sm font-medium text-gray-700">
                Charge (₹)
              </label>
              <input
                type="number"
                id="charge"
                name="charge"
                value={formData.charge}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;
