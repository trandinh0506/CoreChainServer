const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    staffs: {
        type: [
            { userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" } },
        ],
        default: [],
    },
    projectName: String,
    tasks: {
        type: [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
                description: String,
                deadline: Date,
                status: Boolean,
            },
        ],
        default: [],
    },
    completed: Boolean,
});

module.exports = projectSchema;
