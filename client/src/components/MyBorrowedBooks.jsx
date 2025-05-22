import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaBook, FaCalendarAlt, FaUndo, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const MyBorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector(state => state.auth);
  
  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/v1/user/borrowed-books", {
        withCredentials: true
      });
      console.log("Borrowed books response:", response.data);
      if (response.data.success) {
        // Process books to ensure they have all needed properties
        const processedBooks = response.data.borrowedBooks.map(book => ({
          ...book,
          // If book has returnDate or status='returned', mark it as returned
          isReturned: book.isReturned || book.status === 'returned' || book.returndate != null,
          // Calculate fine if not provided
          fineAmount: book.fineAmount || (book.returndate && calculateFine(book.duedate))
        }));
        setBorrowedBooks(processedBooks);
      }
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      toast.error("Failed to fetch your borrowed books");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (borrowId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/borrow/returnborrowedbook/${borrowId}`,
        { email: user.email },
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message || "Book returned successfully");
        
        // Update the local state to mark this book as returned with payment pending
        setBorrowedBooks(prevBooks => 
          prevBooks.map(book => 
            book._id === borrowId 
              ? { 
                  ...book, 
                  isReturned: true, 
                  returndate: new Date(), 
                  paymentPending: true,
                  fineAmount: response.data.fineAmount || calculateFine(book.duedate)
                } 
              : book
          )
        );
        
        // Also update user stats to reflect the change
        try {
          await axios.get('http://localhost:4000/api/v1/user/stats', {
            withCredentials: true
          });
        } catch (error) {
          console.error("Error updating user stats:", error);
        }
      }
    } catch (error) {
      console.error("Error returning book:", error);
      toast.error(error.response?.data?.message || "Failed to return book");
    }
  };

  // Calculate fine based on days overdue
  const calculateFine = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // If overdue, calculate fine (e.g., $1 per day)
    return diffDays > 0 ? diffDays * 1 : 0;
  };

  // Calculate days remaining until the due date
  const getDaysRemaining = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to handle payment (placeholder for now)
  const handlePayFine = (borrowId, amount) => {
    toast.info(`Processing payment of $${amount} for book ID: ${borrowId}`);
    // Implement actual payment logic here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Borrowed Books</h2>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-3 text-gray-600">Loading your borrowed books...</p>
        </div>
      ) : (
        <>
          {borrowedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borrowedBooks.map((borrow) => {
                const daysRemaining = getDaysRemaining(borrow.duedate);
                const isOverdue = daysRemaining < 0;
                const isReturned = borrow.isReturned;
                const fineAmount = borrow.fineAmount || (isReturned && isOverdue ? calculateFine(borrow.duedate) : 0);
                
                return (
                  <div key={borrow._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <FaBook className="text-indigo-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-800">{borrow.book?.title || 'Unknown Book'}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-4">By {borrow.book?.auther || 'Unknown Author'}</p>
                      
                      {/* Status Badge */}
                      <div className={`mb-4 px-3 py-1 inline-block rounded-full text-sm font-medium ${
                        isReturned 
                          ? 'bg-green-100 text-green-800' 
                          : isOverdue 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {isReturned ? 'Returned' : isOverdue ? 'Overdue' : 'Active'}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm">
                          <FaCalendarAlt className="text-gray-500 mr-2" />
                          <div>
                            <span className="font-medium">Borrowed On: </span>
                            {new Date(borrow.borrowdate).toLocaleDateString()}
                          </div>
                        </div>
                        
                        {isReturned ? (
                          <div className="flex items-center text-sm">
                            <FaCalendarAlt className="text-green-500 mr-2" />
                            <div>
                              <span className="font-medium">Returned On: </span>
                              {new Date(borrow.returndate || borrow.returnDate || new Date()).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm">
                            <FaCalendarAlt className={`mr-2 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`} />
                            <div>
                              <span className="font-medium">Due Date: </span>
                              <span className={isOverdue ? 'text-red-500 font-semibold' : ''}>
                                {new Date(borrow.duedate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {isReturned ? (
                        fineAmount > 0 ? (
                          <div className="mb-4">
                            <div className="flex items-center text-amber-700 bg-amber-100 px-3 py-2 rounded-md">
                              <FaMoneyBillWave className="mr-2" />
                              <div>
                                <span className="font-medium">Payment Pending: </span>
                                ${fineAmount}
                              </div>
                            </div>
                            <button 
                              onClick={() => handlePayFine(borrow._id, fineAmount)}
                              className="flex items-center justify-center w-full mt-3 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition"
                            >
                              <FaMoneyBillWave className="mr-2" /> Pay Fine
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center text-green-700 bg-green-100 px-3 py-2 rounded-md mb-4">
                            <FaCheckCircle className="mr-2" />
                            <div>Book returned on time. No payment required.</div>
                          </div>
                        )
                      ) : (
                        <>
                          <div className={`mb-4 px-3 py-2 rounded-md ${
                            isOverdue 
                              ? 'bg-red-100 text-red-800' 
                              : daysRemaining <= 3 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {isOverdue 
                              ? `Overdue by ${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) !== 1 ? 's' : ''}` 
                              : daysRemaining === 0 
                                ? 'Due today' 
                                : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining`
                            }
                          </div>
                          
                          <button
                            onClick={() => handleReturnBook(borrow._id)}
                            className="flex items-center justify-center w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                          >
                            <FaUndo className="mr-2" /> Return Book
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <p className="text-gray-500 mb-4">You haven't borrowed any books yet.</p>
              <p className="text-gray-700">
                Visit the <span className="text-indigo-600 font-medium">Book Catalog</span> to find and borrow books.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyBorrowedBooks;
