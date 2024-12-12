const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authen = require("./Services/authen.Service");
const adminRoute = require("./Routers/admin.Router");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());

// Middleware for authentication
const authMiddleware = (req, res, next) => {
    const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Missing authorization token" });
    }
    const { isSuccess, decoded } = authen.validate(token);
    if (!isSuccess) {
        return res.status(401).json({ message: "Invalid authorization token" });
    }
    // Attach user data to the request for later use
    req.user = decoded;
    next();
};

// Root routes (no authentication required)
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Authenticated routes (apply authMiddleware)
const authRouter = express.Router();
authRouter.use(authMiddleware);

// Protected `/auth` route group
authRouter.use("/admin", adminRoute);

// Example protected route
// authRouter.get("/profile", (req, res) => {
//     res.json({
//         success: true,
//         message: "Welcome to your profile",
//         user: req.user,
//     });
// });

// Mount routers
app.use("/auth", authRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
