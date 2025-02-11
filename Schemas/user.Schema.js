const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fulname: String,
    password: String,
    blockAddress: String,
    email: String,
    phone: String,
    address: String,
    birthday: Date,
    identifiNumber: String,
    position: String,
    salary: Number,
    startWorkDate: Date,
    role: String,
    isActive: Boolean,
});

module.exports = userSchema;
