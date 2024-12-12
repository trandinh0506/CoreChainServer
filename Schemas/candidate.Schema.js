const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    fulName: String,
});

module.exports = candidateSchema;
