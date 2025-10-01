
import express from "express";


// Importing user controller functions
import { login, logout, signUp, getCurrentUser } from "../controller/user.controller.js";
import authentication from "../middleware/authentication.middleware.js";

// Create a router instance
const router = express.Router();

// User sign up route
// User login route
// User logout route
// Get current user route
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authentication, getCurrentUser);


// Export the router
export default router;