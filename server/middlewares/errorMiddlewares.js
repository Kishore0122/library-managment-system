import mongoose from 'mongoose';

class  ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message);
        this.statuscode=statuscode;
    }
}

export const errorMiddleware =(err,req,res,next)=>{
    err.message=err.message || "internal server error";
    err.statuscode=err.statuscode || 500;

    if(err.code===1100){
        err.statuscode=400;
        err.message ="Duplicate Field Value Entered"
        err=new ErrorHandler(err.message , err.statuscode);
    }

    if(err.name==="JsonWebTokenError"){
         err.statuscode=400;
        err.message ="json web token is invalid .Try again"
        err=new ErrorHandler(err.message , err.statuscode);
    }
    if(err.name === "TokeExpiredError"){
         err.statuscode=400;
        err.message ="Your Token is expired"
        err=new ErrorHandler(err.message , err.statuscode);
    }

    if(err.name === "CastError"){
         err.statuscode=400;
        err.message =`Resource not found.Invalid :${err.path}`
        err=new ErrorHandler(err.message , err.statuscode);
    }

    const errormessage =err.errors ? Object.values(err.errors).map(error => error.message).join(" ") :err.message;

    return res.status(err.statuscode).json({
        success:false,
        message:errormessage,
    })

}

export default ErrorHandler;