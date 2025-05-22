import React, { useEffect, useState } from "react";
import userIcon from "../assets/user.png";
import bookIcon from "../assets/book-square.png";
import logo from "../assets/black-logo.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaBook, FaExclamationCircle, FaCalendarAlt, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const UserDashboard = ({ setSelectedComponent }) => {
  const [userStats, setUserStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    returned: 0,
    recentActivity: []
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/user/stats', {
          withCredentials: true
        });
        if (response.data.success) {
          setUserStats(response.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPendingRequests = async () => {
      try {
        setRequestsLoading(true);
        const response = await axios.get('http://localhost:4000/api/v1/borrow-requests/my-requests', {
          withCredentials: true
        });
        if (response.data.success) {
          // Filter only pending requests
          const pending = response.data.requests.filter(req => req.status === 'pending');
          setPendingRequests(pending);
        }
      } catch (error) {
        console.error("Failed to fetch pending requests:", error);
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchUserStats();
    fetchPendingRequests();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaBook className="text-indigo-600 w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Total Borrowed</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{userStats.totalBorrowed || 0}</p>
          <div className="mt-4 bg-indigo-50 px-3 py-1 rounded-full w-fit text-sm text-indigo-700">
            Lifetime Total
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaExclamationCircle className="text-yellow-500 w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Current Loans</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{userStats.currentlyBorrowed || 0}</p>
          <div className="mt-4 bg-indigo-50 px-3 py-1 rounded-full w-fit text-sm text-indigo-700">
            Books to Return
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <FaCheckCircle className="text-green-600 w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Returned Books</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{userStats.returned || 0}</p>
          <div className="mt-4 bg-indigo-50 px-3 py-1 rounded-full w-fit text-sm text-indigo-700">
            Completed Returns
          </div>
        </div>
      </div>

      {/* Pending Requests Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaHourglassHalf className="text-amber-500 w-6 h-6 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Pending Borrow Requests</h3>
          </div>
          <button 
            onClick={() => setSelectedComponent("My Borrow Requests")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            View All Requests
          </button>
        </div>

        {requestsLoading ? (
          <p className="text-gray-600">Loading your requests...</p>
        ) : (
          <>
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.slice(0, 3).map(request => (
                  <div key={request._id} className="flex items-center p-3 bg-amber-50 rounded-lg">
                    <FaBook className="text-indigo-600 mr-3" />
                    <div>
                      <p className="font-medium">{request.book?.title || 'Unknown Book'}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-1" />
                        Requested on {new Date(request.requestDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="ml-auto bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                      Awaiting Approval
                    </span>
                  </div>
                ))}
                {pendingRequests.length > 3 && (
                  <p className="text-sm text-center text-indigo-600">
                    And {pendingRequests.length - 3} more pending requests...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">You don't have any pending book requests.</p>
                <button 
                  onClick={() => setSelectedComponent("Catalog")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Browse Catalog
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
        {userStats.recentActivity && userStats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {userStats.recentActivity.map((activity, index) => (
              <div key={index} className="border-b border-gray-100 pb-3">
                <p className="text-gray-700">{activity.action}</p>
                <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-4">No recent activity to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
