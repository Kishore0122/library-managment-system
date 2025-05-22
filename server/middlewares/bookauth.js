import {catchAsyncErrors} from "./catchasyncerrors.js";
import User from "../models/usermodels.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddlewares.js";
export const authenticatebook = catchAsyncErrors(async(req, res, next) => {
    const {token} = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.id);
    next();

})
export const authorizedbook = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roll)) {
            return next(
                new ErrorHandler(`Role: ${req.user.roll} is not allowed to access this resource`, 403)
            );
        }
        next();
    };
};

