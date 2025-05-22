import express from "express";
import {
  createBorrowRequest,
  getPendingRequests,
  approveBorrowRequest,
  rejectBorrowRequest,
  getUserBorrowRequests
} from "../controllers/borrowrequestcontroller.js";
import { authenticate, authirized } from "../middlewares/authmiddleware.js";

const router = express.Router();

// Routes for borrow requests
router.post("/request/:id", authenticate, createBorrowRequest);
router.get("/requests", authenticate, authirized("Admin"), getPendingRequests);
router.post("/approve/:id", authenticate, authirized("Admin"), approveBorrowRequest);
router.post("/reject/:id", authenticate, authirized("Admin"), rejectBorrowRequest);
router.get("/my-requests", authenticate, getUserBorrowRequests);

export default router; 