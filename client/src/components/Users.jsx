import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaUser, FaUserShield, FaEnvelope, FaTrash, FaUserCog, FaSpinner, FaUserMinus } from "react-icons/fa";
import api from "../api/axios";
import { useSelector } from "react-redux";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState({});
  const { user: currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/all");
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Failed to fetch users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    // Don't allow users to delete themselves
    if (userId === currentUser._id) {
      toast.error("You cannot delete your own account!");
      return;
    }

    // Confirm before deletion
    if (!window.confirm(`Are you sure you want to delete ${userName}'s account? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionInProgress({...actionInProgress, [userId]: 'delete'});
      
      const response = await api.delete(`/user/delete/${userId}`);
      
      if (response.data.success) {
        toast.success(response.data.message || "User deleted successfully");
        // Remove the user from the local state
        setUsers(users.filter(user => user._id !== userId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
      console.error(error);
    } finally {
      setActionInProgress({...actionInProgress, [userId]: null});
    }
  };

  const handleMakeAdmin = async (userId, userName) => {
    // Confirm before promotion
    if (!window.confirm(`Are you sure you want to promote ${userName} to Admin? They will have full administrative access.`)) {
      return;
    }

    try {
      setActionInProgress({...actionInProgress, [userId]: 'promote'});
      
      const response = await api.put(`/user/promote/${userId}`);
      
      if (response.data.success) {
        toast.success(response.data.message || `${userName} has been promoted to Admin`);
        
        // Update the user's role in the local state
        setUsers(users.map(user => 
          user._id === userId ? {...user, roll: "Admin"} : user
        ));
      }
    } catch (error) {
      console.error("Promote to admin error:", error);
      toast.error(error.response?.data?.message || "Failed to promote user to Admin. Please try again.");
    } finally {
      setActionInProgress({...actionInProgress, [userId]: null});
    }
  };

  const handleDismissAdmin = async (userId, userName) => {
    // Don't allow users to dismiss themselves
    if (userId === currentUser._id) {
      toast.error("You cannot dismiss yourself from admin role!");
      return;
    }

    // Confirm before dismissal
    if (!window.confirm(`Are you sure you want to dismiss ${userName} from Admin role? They will lose administrative access.`)) {
      return;
    }

    try {
      setActionInProgress({...actionInProgress, [userId]: 'dismiss'});
      
      const response = await api.put(`/user/dismiss/${userId}`);
      
      if (response.data.success) {
        toast.success(response.data.message || `${userName} has been dismissed from Admin role`);
        
        // Update the user's role in the local state
        setUsers(users.map(user => 
          user._id === userId ? {...user, roll: "User"} : user
        ));
      }
    } catch (error) {
      console.error("Dismiss admin error:", error);
      toast.error(error.response?.data?.message || "Failed to dismiss admin. Please try again.");
    } finally {
      setActionInProgress({...actionInProgress, [userId]: null});
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-3 text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {users.length > 0 ? (
            <div className="overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.profile ? (
                            <img 
                              src={user.profile.url} 
                              alt={user.name} 
                              className="h-10 w-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                              <FaUser className="text-indigo-600" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-xs text-gray-500">ID: {user._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.roll === "Admin" 
                            ? "bg-purple-100 text-purple-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {user.roll === "Admin" ? (
                            <div className="flex items-center">
                              <FaUserShield className="mr-1" />
                              Admin
                            </div>
                          ) : "User"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.accountverified 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {user.accountverified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          {user.roll !== "Admin" && (
                            <button 
                              onClick={() => handleMakeAdmin(user._id, user.name)}
                              disabled={actionInProgress[user._id]}
                              className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors duration-200"
                            >
                              {actionInProgress[user._id] === 'promote' ? (
                                <FaSpinner className="animate-spin mr-1" />
                              ) : (
                                <FaUserCog className="mr-1" />
                              )}
                              Make Admin
                            </button>
                          )}
                          
                          {user.roll === "Admin" && user._id !== currentUser._id && (
                            <button 
                              onClick={() => handleDismissAdmin(user._id, user.name)}
                              disabled={actionInProgress[user._id]}
                              className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors duration-200"
                            >
                              {actionInProgress[user._id] === 'dismiss' ? (
                                <FaSpinner className="animate-spin mr-1" />
                              ) : (
                                <FaUserMinus className="mr-1" />
                              )}
                              Dismiss Admin
                            </button>
                          )}
                          
                          {/* Don't show delete button for the current user */}
                          {user._id !== currentUser._id && (
                            <button 
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              disabled={actionInProgress[user._id]}
                              className="flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-200"
                            >
                              {actionInProgress[user._id] === 'delete' ? (
                                <FaSpinner className="animate-spin mr-1" />
                              ) : (
                                <FaTrash className="mr-1" />
                              )}
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No users found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
