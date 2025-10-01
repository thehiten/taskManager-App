// import jwt from library
// import User model

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authentication = async (req, res, next) => {
    try {
        // Extract token from cookies 
        const token = req.cookies.jwt;

        // Check if token exists
        // If token does not exist, return 400 status code with message
        if (!token) {
            return res.status(400).json({
                message: "Token not found",
            });
        }

        // Decode token and verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(400).json(
                {
                    message: "user not found"
                }
            )

        }

        // Attach user to req objec
        req.user = user;
        // Call next() to proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication middleware error:", error);
        return res.status(500).json({
            message: "Internal server error",

        });


    }
};

export default authentication;



// Summary:
// 1. Import jwt and User model
// 2. Create authentication middleware function
// 3. Extract token from cookies
// 4. Check if token exists, if not return 400 status code with message
// 5. Decode token and verify it using jwt.verify() : required token and secret key
// 6. Find user details using User.findById() with decoded userId
// 7. If user not found, return 400 status code with message    
// 8. If user found, attach user to req object and call next() to proceed to the next middleware or route handler
// 9. If any error occurs, log the error and return 500 status code with