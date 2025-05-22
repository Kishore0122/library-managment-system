import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddNewBookPopup, toggleEditBookPopup, setSelectedBook } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaBook } from "react-icons/fa";
import api from "../api/axios";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, borrowed
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  // Listen for popup states to refresh books after operations
  const { addNewBookPopup, editBookPopup } = useSelector(state => state.popup);

  useEffect(() => {
    fetchBooks();
  }, []);
  
  // Add a listener to refresh books when popups close
  useEffect(() => {
    if (!addNewBookPopup && !editBookPopup) {
      fetchBooks();
    }
  }, [addNewBookPopup, editBookPopup]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/books/all");
      if (response.data.success) {
        setBooks(response.data.books);
      }
    } catch (error) {
      toast.error("Failed to fetch books");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await api.delete(`/books/deletebook/${id}`);
        if (response.data.success) {
          toast.success("Book deleted successfully");
          fetchBooks();
        }
      } catch (error) {
        toast.error("Failed to delete book");
        console.error(error);
      }
    }
  };

  const handleEdit = (book) => {
    dispatch(setSelectedBook(book));
    dispatch(toggleEditBookPopup());
  };

  const handleAddNew = () => {
    dispatch(toggleAddNewBookPopup());
  };
  
  // Add borrow request functionality
  const handleBorrow = async (bookId) => {
    try {
      const response = await api.post(
        `/borrow-requests/request/${bookId}`,
        { email: user.email }
      );
      if (response.data.success) {
        toast.success("Borrow request submitted successfully");
        fetchBooks(); // Refresh book list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit borrow request");
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          book.auther.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "available") return matchesSearch && book.available;
    if (filter === "borrowed") return matchesSearch && !book.available;
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Book Management</h2>
        {user?.roll === "Admin" && (
          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            <FaPlus className="mr-2" /> Add New Book
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">All Books</option>
            <option value="available">Available Only</option>
            <option value="borrowed">Borrowed Only</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-3 text-gray-600">Loading books...</p>
        </div>
      ) : (
        <>
          {filteredBooks.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Charge
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrow
                    </th>
                    {user?.roll === "Admin" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBooks.map((book) => (
                    <tr key={book._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{book.auther}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">₹{book.charge}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{book.quantity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {book.available ? 'Available' : 'Not Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user?.roll === "User" && book.available ? (
                          <button
                            onClick={() => handleBorrow(book._id)}
                            className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-indigo-700 transition flex items-center"
                          >
                            <FaBook className="mr-1 text-xs" />
                            Request
                          </button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {!book.available ? 'Not Available' : (user?.roll === "Admin" ? 'N/A' : '')}
                          </span>
                        )}
                      </td>
                      {user?.roll === "Admin" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(book)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            <FaEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 bg-white shadow-md rounded-lg">
              <p className="text-gray-500">No books found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookManagement;
