import { Borrow } from "../models/borrowmodels.js";
import { BorrowRequest } from "../models/borrowrequestmodel.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchasyncerrors.js";
import { Book } from "../models/bookmodel.js";
import User from "../models/usermodels.js";
import calculateFine from "../utils/finecalculator.js";

// Get all borrowed books
export const borrowedbooks = catchAsyncErrors(async (req, res, next) => {
  // Find all borrowed books for the current user
  const borrowedBooks = await Borrow.find({ "user.id": req.user._id })
    .populate("book", "title auther description charge")
    .sort({ borrowdate: -1 });

  console.log("User ID:", req.user._id);
  console.log("Found borrowed books:", borrowedBooks.length);

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});


export const recordborrowedbooks = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Book ID
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (book.quantity < 1 || book.availability === false) {
    return next(new ErrorHandler("Book not available", 404));
  }

  // Check if user already borrowed this book and not returned yet (assuming user.borrowedbooks has 'returned' boolean)
  const alreadyBorrowed = user.borrowedbooks.find((borrow) => {
    return (
      borrow.book &&
      borrow.book.toString() === book._id.toString() &&
      borrow.returned === false
    );
  });

  if (alreadyBorrowed) {
    return res.status(400).json({
      success: false,
      message:
        "You have already borrowed this book and have not returned it yet.",
    });
  }

  // Update book quantity and availability
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrowDate = Date.now();
  const dueDate = borrowDate + 7 * 24 * 60 * 60 * 1000;

  // Add to user's borrowed books (using returned boolean here)
  user.borrowedbooks.push({
    book: book._id,
    booktitle: book.title,
    borrowdate: borrowDate,
    duedate: dueDate,
    returned: false,
  });
  await user.save();

  // Create Borrow record (use returndate: null instead of false)
  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    booktitle: book.title,
    duedate: dueDate,
    price: book.charge ?? 0,
    returndate: null,
    fine: 0,
  });

  res.status(200).json({
    success: true,
    message: "Book borrowed successfully",
  });
});

// Return borrowed book
export const returnborrowedbook = catchAsyncErrors(async (req, res, next) => {
  const { bookid } = req.params;
  const { email } = req.body;

  console.log("Return book request:", { bookid, email });

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  const normalizedEmail = email.trim().toLowerCase();

  // First, find the borrow record
  const borrowRecord = await Borrow.findById(bookid);
  if (!borrowRecord) {
    return next(new ErrorHandler("Borrow record not found", 404));
  }

  // Now get the book
  const book = await Book.findById(borrowRecord.book);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // Find the user
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Find borrowed book in user's borrowedbooks array
  const borrowedBook = user.borrowedbooks.find(
    (borrow) => borrow.book.toString() === borrowRecord.book.toString() && borrow.returned === false
  );

  if (!borrowedBook) {
    return next(new ErrorHandler("This book was not borrowed by you or has already been returned", 400));
  }

  // Mark as returned in user subdocument
  borrowedBook.returned = true;
  await user.save();

  // Update book quantity and availability
  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Mark borrow record as returned by setting returndate
  borrowRecord.returndate = Date.now();

  // Calculate fine
  const fine = calculateFine(borrowRecord.duedate);
  borrowRecord.fine = fine;
  await borrowRecord.save();

  const baseCharge = borrowRecord.price ?? 0; 
  const totalCharge = baseCharge + fine;

  res.status(200).json({
    success: true,
    message: fine
      ? `Book returned successfully. Total charges including fine: ₹${totalCharge}`
      : `Book returned successfully. Charges: ₹${baseCharge}`,
    fine,
    totalCharge,
  });
});

// Placeholder for admin fetch
export const getborrowedbooksforadmin = catchAsyncErrors(async (req, res) => {
  const borrowedBooks = await Borrow.find();
res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

// Delete borrow records
export const deleteBorrowRecords = catchAsyncErrors(async (req, res, next) => {
  const { ids } = req.body; // Array of borrow record IDs to delete

  if (!ids || !Array.isArray(ids)) {
    return next(new ErrorHandler("Invalid request: ids array is required", 400));
  }

  // First, get all the borrow records to be deleted to get user and book information
  const borrowRecords = await Borrow.find({ _id: { $in: ids } });
  
  if (borrowRecords.length === 0) {
    return next(new ErrorHandler("No borrow records found to delete", 404));
  }

  // Group records by user for efficient updates
  const userRecords = {};
  borrowRecords.forEach(record => {
    if (!userRecords[record.user.id]) {
      userRecords[record.user.id] = [];
    }
    userRecords[record.user.id].push(record);
  });

  // Update each user's borrowedbooks array and delete corresponding borrow requests
  for (const [userId, records] of Object.entries(userRecords)) {
    const user = await User.findById(userId);
    if (user) {
      // Remove the deleted borrow records from user's borrowedbooks array
      user.borrowedbooks = user.borrowedbooks.filter(borrow => 
        !records.some(record => 
          record.book.toString() === borrow.book.toString() && 
          record.borrowdate.getTime() === borrow.borrowdate.getTime()
        )
      );
      await user.save();

      // Delete corresponding approved borrow requests for these books
      for (const record of records) {
        await BorrowRequest.deleteMany({
          "user._id": userId,
          book: record.book,
          status: "approved"
        });
      }
    }
  }

  // Delete the borrow records
  const result = await Borrow.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
    message: `Successfully deleted ${result.deletedCount} borrow record(s)`,
    deletedCount: result.deletedCount
  });
});

// Delete all borrow records
export const deleteAllBorrowRecords = catchAsyncErrors(async (req, res, next) => {
  // First, get all borrow records to get user information
  const borrowRecords = await Borrow.find();
  
  // Group records by user for efficient updates
  const userRecords = {};
  borrowRecords.forEach(record => {
    if (!userRecords[record.user.id]) {
      userRecords[record.user.id] = [];
    }
    userRecords[record.user.id].push(record);
  });

  // Update each user's borrowedbooks array and delete corresponding borrow requests
  for (const [userId, records] of Object.entries(userRecords)) {
    const user = await User.findById(userId);
    if (user) {
      // Remove all borrow records from user's borrowedbooks array
      user.borrowedbooks = user.borrowedbooks.filter(borrow => 
        !records.some(record => 
          record.book.toString() === borrow.book.toString() && 
          record.borrowdate.getTime() === borrow.borrowdate.getTime()
        )
      );
      await user.save();

      // Delete all approved borrow requests for this user
      await BorrowRequest.deleteMany({
        "user._id": userId,
        status: "approved"
      });
    }
  }

  // Delete all borrow records
  const result = await Borrow.deleteMany({});

  res.status(200).json({
    success: true,
    message: `Successfully deleted all borrow records (${result.deletedCount} records)`,
    deletedCount: result.deletedCount
  });
});
