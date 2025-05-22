import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBook, FaUser, FaCheck, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showActionMessage } from "../store/slices/popUpSlice";
import api from "../api/axios";

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/borrow-requests/requests");
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      toast.error("Failed to fetch borrow requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await api.post(
        `/borrow-requests/approve/${requestId}`,
        {}
      );
      if (response.data.success) {
        toast.success("Request approved successfully. Book is now borrowed.");
        
        // Store message in Redux for persistence after refresh
        dispatch(showActionMessage("Request approved successfully. Book is now borrowed."));
        
        // Just update the local state instead of reloading the page
        fetchRequests(); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to approve request";
      toast.error(errorMessage);
      dispatch(showActionMessage(errorMessage, "error"));
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await api.post(
        `/borrow-requests/reject/${requestId}`,
        {}
      );
      if (response.data.success) {
        toast.success("Request rejected");
        dispatch(showActionMessage("Request rejected successfully"));
        fetchRequests(); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reject request";
      toast.error(errorMessage);
      dispatch(showActionMessage(errorMessage, "error"));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Borrow Requests</h2>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-3 text-gray-600">Loading requests...</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {requests.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaBook className="text-indigo-600 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.book.title}</div>
                          <div className="text-sm text-gray-500">By {request.book.auther}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaUser className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{request.user.name}</div>
                          <div className="text-sm text-gray-500">{request.user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2" />
                        {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(request._id)}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center"
                        >
                          <FaCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(request._id)}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center"
                        >
                          <FaTimes className="mr-1" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No pending borrow requests.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowRequests; 