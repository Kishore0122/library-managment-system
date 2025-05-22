import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBook, FaCalendarAlt, FaHourglassHalf, FaCheck, FaTimes, FaArrowRight } from "react-icons/fa";

const MyBorrowRequests = ({ setSelectedComponent }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/v1/borrow-requests/my-requests", {
        withCredentials: true
      });
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      toast.error("Failed to fetch your borrow requests");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaHourglassHalf className="mr-1" />;
      case "approved":
        return <FaCheck className="mr-1" />;
      case "rejected":
        return <FaTimes className="mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Borrow Requests</h2>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-3 text-gray-600">Loading your requests...</p>
        </div>
      ) : (
        <>
          {requests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <FaBook className="text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">{request.book?.title || 'Unknown Book'}</h3>
                    </div>
                    
                    <p className="text-gray-600 mb-4">By {request.book?.auther || 'Unknown Author'}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <FaCalendarAlt className="text-gray-500 mr-2" />
                        <div>
                          <span className="font-medium">Requested On: </span>
                          {new Date(request.requestDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`mb-4 px-3 py-2 rounded-md flex items-center justify-center ${getStatusBadgeClass(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="capitalize">
                        {request.status === "pending" ? "Awaiting Approval" : 
                         request.status === "approved" ? "Approved" : "Rejected"}
                      </span>
                    </div>
                    
                    {request.status === "approved" && (
                      <div className="mb-4">
                        <div className="text-center text-green-600 font-medium mb-2">
                          This book is now available in your borrowed books!
                        </div>
                        <button 
                          onClick={() => setSelectedComponent && setSelectedComponent("My Borrowed Books")}
                          className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          <span>View My Borrowed Books</span>
                          <FaArrowRight className="ml-2" />
                        </button>
                      </div>
                    )}
                    
                    {request.status === "rejected" && (
                      <p className="text-sm text-center text-gray-500">
                        Contact library staff for more information
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">You haven't made any borrow requests yet.</p>
              <p className="text-gray-700 mb-4">
                Visit the <span className="text-indigo-600 font-medium">Book Catalog</span> to request books.
              </p>
              <button 
                onClick={() => setSelectedComponent && setSelectedComponent("Catalog")}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Browse Catalog
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBorrowRequests; 