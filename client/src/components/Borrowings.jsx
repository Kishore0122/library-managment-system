import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBook, FaUser, FaCalendarAlt, FaUndo, FaCheckCircle, FaMoneyBillWave, FaFilter, FaSearch, FaTrash, FaTrashAlt } from "react-icons/fa";
import api from "../api/axios";

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBorrowings, setSelectedBorrowings] = useState([]);
  const [filters, setFilters] = useState({
    status: "all", // all, active, returned, overdue
    searchTerm: "",
  });

  useEffect(() => {
    fetchBorrowings();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters or borrowings change
    applyFilters();
  }, [filters, borrowings]);

  const fetchBorrowings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/borrow/borrowedbooksbyusers");
      if (response.data.success) {
        const processedBorrowings = response.data.borrowedBooks.map(borrow => ({
          ...borrow,
          isOverdue: new Date(borrow.duedate) < new Date() && !borrow.returndate,
          isReturned: !!borrow.returndate,
          daysOverdue: borrow.returndate ? 
            Math.max(0, Math.ceil((new Date(borrow.returndate) - new Date(borrow.duedate)) / (1000 * 60 * 60 * 24))) : 
            Math.max(0, Math.ceil((new Date() - new Date(borrow.duedate)) / (1000 * 60 * 60 * 24)))
        }));
        setBorrowings(processedBorrowings);
      }
    } catch (error) {
      toast.error("Failed to fetch borrowings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...borrowings];
    
    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(borrow => {
        if (filters.status === "active") return !borrow.isReturned && !borrow.isOverdue;
        if (filters.status === "returned") return borrow.isReturned;
        if (filters.status === "overdue") return borrow.isOverdue;
        return true;
      });
    }
    
    // Apply search term filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(borrow => 
        (borrow.user?.name && borrow.user.name.toLowerCase().includes(searchLower)) ||
        (borrow.user?.email && borrow.user.email.toLowerCase().includes(searchLower)) ||
        (borrow.booktitle && borrow.booktitle.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredBorrowings(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already applied through the useEffect
  };

  // Calculate days remaining or overdue
  const getDaysStatus = (dueDate, returnDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const returned = returnDate ? new Date(returnDate) : null;
    
    if (returned) {
      const diffDays = Math.ceil((returned - due) / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        return {
          label: `Returned ${diffDays} day${diffDays !== 1 ? 's' : ''} late`,
          className: "text-red-600"
        };
      } else {
        return {
          label: "Returned on time",
          className: "text-green-600"
        };
      }
    } else {
      const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        return {
          label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`,
          className: "text-red-600 font-semibold"
        };
      } else if (diffDays === 0) {
        return {
          label: "Due today",
          className: "text-yellow-600 font-semibold"
        };
      } else {
        return {
          label: `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`,
          className: "text-green-600"
        };
      }
    }
  };

  // Admin can manually mark a book as returned
  const handleMarkAsReturned = async (borrowId) => {
    try {
      // First, get the user email from the borrowing record
      const borrowRecord = filteredBorrowings.find(b => b._id === borrowId);
      if (!borrowRecord?.user?.email) {
        toast.error("User email not found in borrow record");
        return;
      }

      const response = await api.put(
        `/borrow/returnborrowedbook/${borrowId}`,
        { email: borrowRecord.user.email }
      );
      
      if (response.data.success) {
        toast.success(response.data.message || "Book marked as returned successfully");
        // Refresh the borrowings list
        fetchBorrowings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark book as returned");
    }
  };

  const handleSelectBorrowing = (borrowId) => {
    setSelectedBorrowings(prev => {
      if (prev.includes(borrowId)) {
        return prev.filter(id => id !== borrowId);
      } else {
        return [...prev, borrowId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedBorrowings.length === filteredBorrowings.length) {
      setSelectedBorrowings([]);
    } else {
      setSelectedBorrowings(filteredBorrowings.map(b => b._id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedBorrowings.length === 0) {
      toast.warning("Please select borrow records to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedBorrowings.length} selected borrow record(s)?`)) {
      return;
    }

    try {
      const response = await api.delete("/borrow/delete-records", {
        data: { ids: selectedBorrowings }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedBorrowings([]);
        fetchBorrowings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete borrow records");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL borrow records? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await api.delete("/borrow/delete-all-records");
      
      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedBorrowings([]);
        fetchBorrowings();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete all borrow records");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Borrowings Management</h2>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <div className="flex items-center">
            <FaFilter className="text-gray-500 mr-2" />
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="block w-full sm:w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
            <input
              type="text"
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
              placeholder="Search user or book..."
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaSearch className="mr-2" />
              Search
            </button>
          </form>

          <div className="flex space-x-2">
            <button
              onClick={handleDeleteSelected}
              disabled={selectedBorrowings.length === 0}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                selectedBorrowings.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              <FaTrash className="mr-1" /> Delete Selected
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={borrowings.length === 0}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                borrowings.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              <FaTrashAlt className="mr-1" /> Delete All
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-3 text-gray-600">Loading borrowings...</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {filteredBorrowings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedBorrowings.length === filteredBorrowings.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrowed Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBorrowings.map((borrow) => {
                    const daysStatus = getDaysStatus(borrow.duedate, borrow.returndate);
                    
                    return (
                      <tr key={borrow._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedBorrowings.includes(borrow._id)}
                            onChange={() => handleSelectBorrowing(borrow._id)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaBook className="text-indigo-600 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{borrow.booktitle}</div>
                              <div className="text-sm text-gray-500">ID: {borrow.book}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="text-gray-500 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{borrow.user?.name}</div>
                              <div className="text-sm text-gray-500">{borrow.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="mr-2" />
                            {new Date(borrow.borrowdate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="mr-2" />
                            {new Date(borrow.duedate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${daysStatus.className}`}>
                            {borrow.isReturned ? (
                              <div className="flex items-center">
                                <FaCheckCircle className="mr-1" />
                                Returned on {new Date(borrow.returndate).toLocaleDateString()}
                              </div>
                            ) : (
                              daysStatus.label
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {borrow.fine > 0 ? (
                              <div className="flex items-center text-amber-600">
                                <FaMoneyBillWave className="mr-1" />
                                ${borrow.fine.toFixed(2)}
                              </div>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!borrow.isReturned && (
                            <button
                              onClick={() => handleMarkAsReturned(borrow._id)}
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center"
                            >
                              <FaUndo className="mr-1" /> Mark as Returned
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No borrowings found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Borrowings Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="font-medium text-gray-500">Total Borrowings</div>
            <div className="text-2xl font-bold text-gray-800">{borrowings.length}</div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="font-medium text-gray-500">Active Borrowings</div>
            <div className="text-2xl font-bold text-green-600">
              {borrowings.filter(b => !b.isReturned && !b.isOverdue).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="font-medium text-gray-500">Overdue</div>
            <div className="text-2xl font-bold text-red-600">
              {borrowings.filter(b => b.isOverdue).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <div className="font-medium text-gray-500">Total Fines</div>
            <div className="text-2xl font-bold text-amber-600">
              ${borrowings.reduce((sum, b) => sum + (b.fine || 0), 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Borrowings; 