import express from 'express';
import { catchAsyncErrors } from '../middlewares/catchasyncerrors.js';
import {Book} from '../models/bookmodel.js';
import User from "../models/usermodels.js";
import ErrorHandler from '../middlewares/errorMiddlewares.js';


export const addbook = catchAsyncErrors(async (req, res, next) => {
  const { title, auther, description, charge, quantity } = req.body;

  if (!title || !auther || !description || !charge || !quantity) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  const book = await Book.create({
    title,
    auther,
    description,
    charge,
    quantity,
    available: quantity > 0, // ✅ Convert quantity to true/false
  });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

export const getallbooks = catchAsyncErrors(async (req, res) => {
  const books = await Book.find();
  
  // Update the available property for each book based on quantity
  const updatedBooks = books.map(book => {
    // Convert Mongoose document to plain object
    const bookObj = book.toObject();
    // Update available property based on quantity
    bookObj.available = book.quantity > 0;
    return bookObj;
  });
  
  res.status(200).json({
    success: true,
    message: "All books fetched successfully",
    books: updatedBooks,
  });
});

export const deletebook = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id);

  if (!book) {
    return res.status(404).json({
      success: false,
      message: "Book not found",
    });
  }

  await Book.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});
