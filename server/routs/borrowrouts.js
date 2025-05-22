// Corrected route configuration to match your existing setup 

import {
  returnborrowedbook,
  getborrowedbooksforadmin,
  recordborrowedbooks,
  borrowedbooks,
  deleteBorrowRecords,
  deleteAllBorrowRecords
} from "../controllers/borrowcomtrollers.js";
import { authenticate, authirized } from "../middlewares/authmiddleware.js";
import express from "express";

const router = express.Router();

// Corrected middleware order and endpoint names
router.post("/record-borrowed-books/:id", authenticate, authirized("Admin", "User"), recordborrowedbooks);
router.get("/borrowedbooksbyusers", authenticate, authirized("Admin"), getborrowedbooksforadmin);
router.get("/myborrowedbooks", authenticate, borrowedbooks); // Changed to match frontend endpoint
router.get("/user/borrowed-books", authenticate, borrowedbooks); // Added alias for frontend endpoint
router.put("/returnborrowedbook/:bookid", authenticate, authirized("Admin", "User"), returnborrowedbook);

// Add new routes for deleting borrow records
router.delete("/delete-records", authenticate, authirized("Admin"), deleteBorrowRecords);
router.delete("/delete-all-records", authenticate, authirized("Admin"), deleteAllBorrowRecords);

export default router;
