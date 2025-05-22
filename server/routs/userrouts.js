import express from "express"

import {
    getallusers,
    newadmin, 
    getUserStats, 
    getAdminStats,
    getUserProfile,
    updateUserProfile,
    promoteToAdmin,
    dismissAdmin,
    deleteUser
} from "../controllers/usercontroller.js"

import {authenticate,authirized} from "../middlewares/authmiddleware.js"

import { borrowedbooks } from "../controllers/borrowcomtrollers.js";

const router = express.Router();

// Admin routes
router.get("/all", authenticate, authirized("Admin"), getallusers);
router.post("/add/new-admin", authenticate, authirized("Admin"), newadmin);
router.get("/admin/stats", authenticate, authirized("Admin"), getAdminStats);

// User management routes
router.put("/promote/:userId", authenticate, authirized("Admin"), promoteToAdmin);
router.put("/dismiss/:userId", authenticate, authirized("Admin"), dismissAdmin);
router.delete("/delete/:userId", authenticate, authirized("Admin"), deleteUser);

// User routes
router.get("/stats", authenticate, getUserStats);
router.get("/borrowed-books", authenticate, borrowedbooks);
router.get("/profile", authenticate, getUserProfile);
router.put("/profile/update", authenticate, updateUserProfile);

export default router;
