import express from "express";
import { config } from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import connect from "./database/db.js"
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routs/authrout.js";
import bookRouter from "./routs/bookrouts.js";
import borrowRouter from "./routs/borrowrouts.js";
import borrowRequestRouter from "./routs/borrowrequestsrouts.js";
import expressfileupload from "express-fileupload";
import userrouts from "./routs/userrouts.js";
import { notifyuser } from "./services/notifyusers.js";
import { removeunverifiedaccounts } from "./services/removeunverifiedaccounts.js";


export const app=express();
config({path:"./config/consfig.env"})
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
app.use(cors({
    origin: "http://localhost:5180",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressfileupload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}))
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/books",bookRouter);
app.use("/api/v1/borrow",borrowRouter);
app.use("/api/v1/borrow-requests", borrowRequestRouter);
app.use("/api/v1/user",userrouts);
// Create a direct route for admin stats
app.get("/api/v1/admin/stats", async (req, res, next) => {
  try {
    // Import the controller directly
    const { getAdminStats } = await import('./controllers/usercontroller.js');
    // Call the controller function
    getAdminStats(req, res, next);
  } catch (error) {
    next(error);
  }
});

notifyuser();
removeunverifiedaccounts();
connect();
app.use(errorMiddleware);
// boiler plate code above lines are same for all