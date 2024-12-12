const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: String,
    description: String,
    requirement: String,
    position: String,
    salary: String,
});
