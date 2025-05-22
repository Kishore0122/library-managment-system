import React, { useEffect, useState } from "react";
import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaBell, FaBook, FaClipboardList } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const AdminDashboard = ({ setSelectedComponent }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalUsers: 0,
    totalAdmins: 0
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/admin/stats', {
          withCredentials: true
        });
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    const fetchPendingRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/api/v1/borrow-requests/requests', {
          withCredentials: true
        });
        if (response.data.success) {
          const pending = response.data.requests.filter(req => req.status === 'pending');
          setPendingRequests(pending);
        }
      } catch (error) {
        console.error("Failed to fetch pending requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchPendingRequests();
  }, []);

  const bookPieData = {
    labels: ['Available Books', 'Borrowed Books'],
    datasets: [
      {
        data: [stats.availableBooks, stats.borrowedBooks],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const userPieData = {
    labels: ['Regular Users', 'Admins'],
    datasets: [
      {
        data: [stats.totalUsers, stats.totalAdmins],
        backgroundColor: ['#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FFCE56', '#4BC0C0'],
      },
    ],
  };

  // For development/debugging: log statistics
  useEffect(() => {
    console.log("Current stats:", stats);
  }, [stats]);

  return (
    <div className="px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h1>
          <img src={adminIcon} alt="admin" className="w-8 h-8 ml-2" />
        </div>
        <div className="flex items-center">
          <img src={logo} alt="logo" className="w-6 h-6 mr-2" />
          <h2 className="text-lg font-semibold text-gray-700">Admin Dashboard</h2>
        </div>
      </div>

      {/* Pending Borrow Requests Card - Move to top */}
      <div className="bg-amber-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-amber-500">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaBell className="text-amber-500 w-8 h-8 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pending Borrow Requests</h3>
              {pendingRequests.length > 0 && (
                <p className="text-amber-600">
                  You have <span className="font-bold">{pendingRequests.length}</span> pending requests awaiting approval
                </p>
              )}
            </div>
          </div>
          <button 
            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 flex items-center transition-colors"
            onClick={() => setSelectedComponent("Borrow Requests")}
          >
            <FaClipboardList className="mr-2" />
            View All Requests
          </button>
        </div>
        
        {loading ? (
          <p className="text-gray-600">Loading pending requests...</p>
        ) : (
          <>
            {pendingRequests.length > 0 ? (
              <div className="space-y-3 mb-4">
                {pendingRequests.slice(0, 3).map(request => (
                  <div key={request._id} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                    <FaBook className="text-indigo-600 mr-3" />
                    <div className="flex-grow">
                      <p className="font-medium">{request.book?.title || 'Unknown Book'}</p>
                      <p className="text-sm text-gray-600">Requested by: {request.user?.name}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedComponent("Borrow Requests")}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Review
                    </button>
                  </div>
                ))}
                {pendingRequests.length > 3 && (
                  <p className="text-sm text-center text-amber-600 font-medium">
                    And {pendingRequests.length - 3} more pending requests...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-600 mb-4">You don't have any pending book requests to review.</p>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <img src={bookIcon} alt="books" className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Total Books</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalBooks}</p>
          <div className="mt-4 bg-indigo-50 px-3 py-1 rounded-full w-fit text-sm text-indigo-700">
            Library Collection
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <img src={usersIcon} alt="users" className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
          <div className="mt-4 bg-indigo-50 px-3 py-1 rounded-full w-fit text-sm text-indigo-700">
            Registered Members
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <img src={bookIcon} alt="borrowed" className="w-8 h-8 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700">Borrowed Books</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{stats.borrowedBooks}</p>
          <div className="mt-4 bg-indigo-50 px-3 py-1 rounded-full w-fit text-sm text-indigo-700">
            Currently Checked Out
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Book Status</h3>
          <div className="h-64">
            <Pie data={bookPieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">User Distribution</h3>
          <div className="h-64">
            <Pie data={userPieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
