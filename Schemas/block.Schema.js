const mongoose = require("mongoose");

const blockSchema = new mongoose.Schema({
    hash: String,
    data: String,
    prevHash: String,
    timeStamp: Date,
    nonce: Number,
});
module.exports = blockSchema;
