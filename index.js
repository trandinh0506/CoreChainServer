const express = require("express");
const cors = require("cors");
require("dotenv").config();
const database = require("./Config/database");
const authRouter = require("./Routers/auth.Router");
const PORT = process.env.PORT || 3001;
const app = express();

database.connect();
app.use(express.json());

// Root routes (no authentication required)
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/auth", authRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
