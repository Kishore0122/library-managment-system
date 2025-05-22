import ErrorHandler from "../middlewares/errorMiddlewares.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/usermodels.js";
import { sendVerificationCode } from "../utils/sendverificationcode.js";
import { sendtokan } from "../utils/sendtokan.js";
import { generatepasswordresetemailtemplate } from "../utils/emailtemplate.js";
import { sendEmail } from "../utils/sendemail.js"; 
import { catchAsyncErrors } from "../middlewares/catchasyncerrors.js";
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields.", 400));
    }

    const isregister = await User.findOne({ email, accountverified: true });
    if (isregister) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const registrationAttemptsByuser = await User.find({
      email,
      accountverified: false,
    });

    if (registrationAttemptsByuser.length >= 5) {
      return next(
        new ErrorHandler(
          "You have exceeded the maximum number of registration attempts. Please try again later.",
          429
        )
      );
    }

    if (password.length < 8 || password.length > 18) {
      return next(
        new ErrorHandler(
          "Password must be between 8 and 18 characters long",
          400
        )
      );
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedpassword,
    });

    user.generateverificationcode();
    await user.save();
    sendVerificationCode(email, user.verificatiocode, res);
  } catch (error) {
    next(error);
  }
});

export const verifyotp = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  try {
    const userallentries = await User.find({
      email,
      accountverified: false,
    }).sort({ createdAt: -1 });

    if (userallentries.length === 0) {
      return next(new ErrorHandler("No user found with this email", 404));
    }

    let user;
    if (userallentries.length > 1) {
      user = userallentries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountverified: false,
      });
    } else {
      user = userallentries[0];
    }

    if (user.verificatiocode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }

    const currentTime = Date.now();
    const verificatiocodeexpiry = new Date(user.verificationexpire).getTime();
    if (currentTime > verificatiocodeexpiry) {
      return next(
        new ErrorHandler("Verification code has expired", 400)
      );
    }

    user.accountverified = true;
    user.verificatiocode = null;
    user.verificationexpire = null;
    await user.save({ validateModifiedOnly: true });

    sendtokan(user, 200, "Account verified successfully", res);
  } catch (error) {
    return next(new ErrorHandler("Internal server error.", 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  const user = await User.findOne({ email, accountverified: true }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const ispasswordmatched = await bcrypt.compare(password, user.password);
  if (!ispasswordmatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendtokan(user, 200, "Login successful", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getuser = catchAsyncErrors(async (req, res, next) => {
  const User = req.user;

  res.status(200).json({
    success: true,
    User,
  });
});

export const forgotpassword = catchAsyncErrors(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorHandler("Please enter valid email", 400));
  }

  const user = await User.findOne({ email: req.body.email });

  if (!user || !user.email) {
    return next(new ErrorHandler("User not found or missing email", 404));
  }

  const resetToken = user.getresetpasswordtoken();
  await user.save({ validateBeforeSave: false });

  const resetpasswordurl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generatepasswordresetemailtemplate(resetpasswordurl);

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Recovery for library management system",
      message,
    });

    res.status(200).json({
      success: true,
      message: ` Password reset Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetpassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetpasswordtoken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetpasswordtoken,
    resetpasswordexpire: { $gt: Date.now() },
});
  if (!user) {
    return next(new ErrorHandler("NOT AN USER", 400));
  }

  if (req.body.password !== req.body.confirmpassword) {
    return next(new ErrorHandler("Password not matched", 400));
  }

  if (req.body.password.length < 8 || req.body.password.length > 18) {
    return next(
      new ErrorHandler("Password must be between 8 and 18 characters long", 400)
    );
  }
const hashedpassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedpassword;


  user.resetpasswordtoken = undefined;
  user.resetpasswordexpire = undefined;
  await user.save();

  sendtokan(user, 200, "Password reset successfully", res);
});

export const updatepassword = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    const { oldpassword, newpassword, confirmpassword } = req.body;

    if (!oldpassword || !newpassword || !confirmpassword) {
      return next(new ErrorHandler("Please enter all fields.", 400));
    }
    if (newpassword !== confirmpassword) {
      return next(new ErrorHandler("Password not matched", 400));
    }
    if (newpassword.length < 8 || newpassword.length > 18) {
      return next(
        new ErrorHandler("Password must be between 8 and 18 characters long", 400)
      );
    }
    const ispasswordmatched = await bcrypt.compare(oldpassword, user.password);
    if (!ispasswordmatched) {
      return next(new ErrorHandler("Old password is incorrect", 401));
    }
    const hashedpassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedpassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("Internal server error.", 500));
  }
});

export const resendOTP = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  try {
    // Find the latest unverified user with this email
    const user = await User.findOne({ 
      email, 
      accountverified: false 
    }).sort({ createdAt: -1 });

    if (!user) {
      return next(new ErrorHandler("No pending registration found with this email", 404));
    }

    // Generate a new verification code
    user.generateverificationcode();
    await user.save();

    // Send the new verification code
    sendVerificationCode(email, user.verificatiocode, res);
  } catch (error) {
    return next(new ErrorHandler("Error resending OTP", 500));
  }
});

