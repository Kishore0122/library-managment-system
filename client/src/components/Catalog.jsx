import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch, FaBook } from "react-icons/fa";
import { useSelector } from "react-redux";

const Catalog = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, available, borrowed
  
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/v1/books/all", {
        withCredentials: true
      });
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

  const handleBorrow = async (bookId) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/borrow-requests/request/${bookId}`,
        { email: user.email },
        {
          withCredentials: true
        }
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Catalog</h2>

      {/* Add explanation section for users */}
      {user?.roll === "User" && (
        <div className="bg-indigo-50 p-6 rounded-lg mb-6 border-l-4 border-indigo-500">
          <h3 className="text-xl font-semibold text-indigo-800 mb-3">How to Borrow Books</h3>
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <ol className="list-decimal list-inside text-gray-700 ml-2 space-y-2">
                <li>Find a book you'd like to read</li>
                <li>Click the <span className="font-semibold text-indigo-700">"Request Book"</span> button</li>
                <li>Librarian will review your request</li>
                <li>Once approved, the book will appear in <span className="font-semibold text-indigo-700">"My Borrowed Books"</span></li>
                <li>Check <span className="font-semibold text-indigo-700">"My Requests"</span> to see the status of your requests</li>
              </ol>
            </div>
            <div className="mt-4 md:mt-0 flex-1">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-700 mb-3"><span className="font-semibold">Important:</span> Books must be approved by a librarian before you can borrow them.</p>
                <button 
                  onClick={() => setSelectedComponent && setSelectedComponent("My Borrow Requests")}
                  className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center"
                >
                  <FaBook className="mr-2" /> View My Pending Requests
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <option value="borrowed">Not Available</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-3 text-gray-600">Loading books...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book.available ? 'Available' : 'Not Available'}
                      </span>
                      {user?.roll === "User" && book.available && (
                        <button
                          onClick={() => handleBorrow(book._id)}
                          className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-indigo-700 transition flex items-center"
                        >
                          <FaBook className="mr-1 text-xs" />
                          Request
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">By {book.auther}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Charge:</span> ₹{book.charge}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Quantity:</span> {book.quantity}
                    </p>
                  </div>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{book.description}</p>
                  
                  {user?.roll === "User" && !book.available && (
                    <div className="bg-red-50 p-2 rounded text-center text-sm text-red-700">
                      This book is currently not available for borrowing
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-white shadow-md rounded-lg">
              <p className="text-gray-500">No books found matching your criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catalog;
