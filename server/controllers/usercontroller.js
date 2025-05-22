import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchasyncerrors.js";
import User from "../models/usermodels.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { Borrow } from "../models/borrowmodels.js";
import { Book } from "../models/bookmodel.js";
// Ensure express-fileupload middleware is used in your main app.js/server.js file
// import fileUpload from "express-fileupload";
// app.use(fileUpload({ useTempFiles: true }));

export const getallusers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({accountverified: true}).select("-password");
    
    res.status(200).json({
        success: true,
        users,
    });
})

export const newadmin = catchAsyncErrors(async (req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Please upload a Profile Picture", 400));
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const isregistered = await User.findOne({ email, accountverified: true });
    if (isregistered) {
        return next(new ErrorHandler("User already registered", 400));
    }

    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
    }

    const { profile } = req.files;
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(profile.mimetype)) {
        return next(new ErrorHandler("File format is not supported", 400));
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    let cloudinaryResponse;
    try {
        cloudinaryResponse = await cloudinary.uploader.upload(profile.tempFilePath, {
            folder: "Admin_profiles",
        });
    } catch (error) {
        console.error("cloudinary error", error);
        return next(new ErrorHandler("Failed to upload profile", 500));
    }

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("cloudinary error", cloudinaryResponse.error || "unknown cloudinary error");
        return next(new ErrorHandler("Failed to upload profile", 500));
    }

    const admin = await User.create({
        name,
        email,
        password: hashedpassword,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
        accountverified: true,
        roll: "Admin",
    });

    res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        admin,
    });
});

export const getUserStats = catchAsyncErrors(async (req, res, next) => {
    console.log("Getting stats for user ID:", req.user._id);
    
    // Get user stats for the logged-in user - try both user.id and user._id formats
    const borrowedBooks = await Borrow.find({
        $or: [
            { "user.id": req.user._id },
            { "user._id": req.user._id }
        ]
    }).populate("book", "title"); // Populate book details to get title
    
    console.log("Found borrowed books:", borrowedBooks.length);
    
    const stats = {
        totalBorrowed: borrowedBooks.length,
        currentlyBorrowed: borrowedBooks.filter(book => !book.returndate).length,
        returned: borrowedBooks.filter(book => book.returndate).length,
        recentActivity: borrowedBooks.slice(0, 5).map(book => ({
            action: book.returndate 
                ? `Returned "${book.book?.title || book.booktitle || 'a book'}"` 
                : `Borrowed "${book.book?.title || book.booktitle || 'a book'}"`,
            date: book.returndate || book.borrowdate
        }))
    };
    
    res.status(200).json({
        success: true,
        stats
    });
});

export const getAdminStats = catchAsyncErrors(async (req, res, next) => {
    // Get stats for admin dashboard
    const totalBooks = await Book.countDocuments();
    const borrowedBooks = await Borrow.countDocuments({ returndate: null });
    const totalUsers = await User.countDocuments({ roll: "User", accountverified: true });
    const totalAdmins = await User.countDocuments({ roll: "Admin", accountverified: true });
    
    const stats = {
        totalBooks,
        availableBooks: totalBooks - borrowedBooks,
        borrowedBooks,
        totalUsers,
        totalAdmins
    };
    
    res.status(200).json({
        success: true,
        stats
    });
});

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    res.status(200).json({
        success: true,
        user
    });
});

export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    // Update name if provided
    if (req.body.name) {
        user.name = req.body.name;
    }
    
    // Handle profile picture update if a file is uploaded
    if (req.files && req.files.profile) {
        const { profile } = req.files;
        const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
        
        if (!allowed.includes(profile.mimetype)) {
            return next(new ErrorHandler("File format is not supported", 400));
        }
        
        // Delete old profile picture if exists
        if (user.avatar && user.avatar.public_id) {
            try {
                await cloudinary.uploader.destroy(user.avatar.public_id);
            } catch (error) {
                console.error("Error deleting old profile picture:", error);
            }
        }
        
        // Upload new profile picture
        try {
            const cloudinaryResponse = await cloudinary.uploader.upload(profile.tempFilePath, {
                folder: user.roll === "Admin" ? "Admin_profiles" : "User_profiles",
            });
            
            user.avatar = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        } catch (error) {
            return next(new ErrorHandler("Failed to upload profile picture", 500));
        }
    }
    
    await user.save();
    
    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user
    });
});

export const promoteToAdmin = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    if (user.roll === "Admin") {
        return next(new ErrorHandler("User is already an admin", 400));
    }
    
    user.roll = "Admin";
    await user.save();
    
    res.status(200).json({
        success: true,
        message: "User promoted to admin successfully",
        user
    });
});

export const dismissAdmin = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.params;
    
    // Don't allow self-dismissal
    if (userId === req.user._id.toString()) {
        return next(new ErrorHandler("You cannot dismiss yourself from admin role", 400));
    }
    
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    if (user.roll !== "Admin") {
        return next(new ErrorHandler("User is not an admin", 400));
    }
    
    user.roll = "User";
    await user.save();
    
    res.status(200).json({
        success: true,
        message: "Admin dismissed successfully",
        user
    });
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
    const { userId } = req.params;
    
    // Don't allow self-deletion
    if (userId === req.user._id.toString()) {
        return next(new ErrorHandler("You cannot delete your own account", 400));
    }
    
    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    
    // Delete user's profile picture if exists
    if (user.profile && user.profile.public_id) {
        try {
            await cloudinary.uploader.destroy(user.profile.public_id);
        } catch (error) {
            console.error("Error deleting user's profile picture:", error);
        }
    }
    
    // Delete user's borrowed books records
    await Borrow.deleteMany({ user: userId });
    
    // Delete the user
    await user.deleteOne();
    
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});
