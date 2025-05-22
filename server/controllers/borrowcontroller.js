
import {catchAsyncErrors}from "../middlewares/catchasyncErrors.js"
import ErrorHandler from '../middlewares/errorMiddlewares.js';
import { Book } from "../models/bookmodel.js";
import  User  from "../models/usermodels.js";
import { Borrow } from "../models/borrowmodal.js";

export const recordborrowedbook = catchAsyncErrors(async (req, res, next) => {

const {id} = req.params;
const { email, role } = req.user;
if (!role) {
    return next(new ErrorHandler(`Role: ${role} is not allowed to access this resource`, 403));
}

const book = await Book.findById(id);
if(!book){
    return next(new ErrorHandler("Book not found",404))
}

const user = await User.findOne({ email});
if (!user) {
    return next(new ErrorHandler("User not found", 404));
}
if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available", 404));
}

const isbookborrowed = user.borrowedbooks.find(
    b => b.book.toString() === id && b.returned === false
);
if (isbookborrowed) {
    return next(new ErrorHandler("Book already borrowed", 404));
}
book.quantity -= 1;
book.availability = book.quantity > 0;
await book.save();

user.borrowedbooks.push({
    book: book._id,
    returned: false,
    borrowdate: Date.now(),
    duedate: Date.now() + 7 * 24 * 60 * 60 * 1000,
});
await user.save();
await Borrow.create({
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
    },
    book: book._id,
    charge: book.charge,
    duedate: Date.now() + 7 * 24 * 60 * 60 * 1000,
});
res.status(200).json({
    success: true,
    message: "Book borrowed successfully",
});

})

export const borrowedbook = catchAsyncErrors(async (req, res, next) =>{

})

export const getborrowedbooksfromadmin = catchAsyncErrors(async (req, res, next) => {

})

export const returnborrowedbook = catchAsyncErrors(async (req, res, next) => {

})
