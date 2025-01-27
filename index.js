const express = require("express");
const cors = require("cors");
require("dotenv").config();
const database = require("./Config/database");
const authen = require("./Services/authen.Service");
const adminRoute = require("./Routers/admin.Router");
const managerRoute = require("./Routers/manager.Router");
const blockchainRoute = require("./Routers/blockchain.Router");
const PORT = process.env.PORT || 3001;
const app = express();

database.connect();
app.use(express.json());
// Middleware for authentication
const { requireAuth } = require("./Middlewares/auth.Middleware"); 

// Root routes (no authentication required)
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Authenticated routes (apply requireAuth)
const authRouter = express.Router();
authRouter.use(requireAuth);

// Protected `/auth` route group
authRouter.use("/admin", adminRoute);
authRouter.use("/manager", managerRoute);
authRouter.use("/blockchain", blockchainRoute);
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
