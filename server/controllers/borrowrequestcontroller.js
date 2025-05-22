import { BorrowRequest } from "../models/borrowrequestmodel.js";
import { Book } from "../models/bookmodel.js";
import User from "../models/usermodels.js";
import { catchAsyncErrors } from "../middlewares/catchasyncerrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { recordborrowedbooks } from "./borrowcomtrollers.js";

// Create a borrow request
export const createBorrowRequest = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Book ID
  const { email } = req.body;

  // Find the book
  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  // Check if book is available
  if (book.quantity < 1 || book.available === false) {
    return next(new ErrorHandler("Book not available", 400));
  }

  // Find the user
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Check if user already has a pending request for this book
  const existingRequest = await BorrowRequest.findOne({
    "user._id": user._id,
    book: book._id,
    status: "pending"
  });

  if (existingRequest) {
    return next(new ErrorHandler("You already have a pending request for this book", 400));
  }

  // Create a new borrow request
  const borrowRequest = await BorrowRequest.create({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email
    },
    book: book._id,
    requestDate: Date.now(),
    status: "pending"
  });

  res.status(201).json({
    success: true,
    message: "Borrow request submitted successfully",
    borrowRequest
  });
});

// Get all pending borrow requests (Admin only)
export const getPendingRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await BorrowRequest.find({ status: "pending" })
    .populate("book", "title auther description charge")
    .sort({ requestDate: -1 });

  res.status(200).json({
    success: true,
    requests
  });
});

// Approve a borrow request
export const approveBorrowRequest = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Request ID

  // Find the request
  const request = await BorrowRequest.findById(id);
  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (request.status !== "pending") {
    return next(new ErrorHandler("This request has already been processed", 400));
  }

  // Update request status
  request.status = "approved";
  await request.save();

  // Process the actual borrowing
  // We'll reuse the existing recordborrowedbooks function
  // But first we need to modify the request object to match what recordborrowedbooks expects
  req.params.id = request.book;
  req.body.email = request.user.email;
  
  // Call the recordborrowedbooks function
  await recordborrowedbooks(req, res, next);
});

// Reject a borrow request
export const rejectBorrowRequest = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Request ID

  // Find the request
  const request = await BorrowRequest.findById(id);
  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  if (request.status !== "pending") {
    return next(new ErrorHandler("This request has already been processed", 400));
  }

  // Update request status
  request.status = "rejected";
  await request.save();

  res.status(200).json({
    success: true,
    message: "Borrow request rejected"
  });
});

// Get user's borrow requests
export const getUserBorrowRequests = catchAsyncErrors(async (req, res, next) => {
  const requests = await BorrowRequest.find({ "user._id": req.user._id })
    .populate("book", "title auther description charge")
    .sort({ requestDate: -1 });

  res.status(200).json({
    success: true,
    requests
  });
}); 