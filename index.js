const express = require("express");
const cors = require("cors");
require("dotenv").config();
const database = require("./Config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./Routers/auth.Router");
const PORT = process.env.PORT || 3001;
const app = express();

database.connect();
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
