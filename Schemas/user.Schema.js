const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fulname: String,
    userName: String,
    password: String,
    blockAddress: String,
    email: String,
    address: String,
    identifiNumber: String,
    position: String,
    salary: Number,
    startWorkDate: Date,
    role: String,
});

module.exports = userSchema;
