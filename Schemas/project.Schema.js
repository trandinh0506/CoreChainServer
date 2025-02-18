const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema({
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    staffs: {
        type: [
            { staffId: { type: mongoose.Schema.Types.ObjectId, ref: "user" } },
        ],
        default: [],
    },
    projectName: String,
    description: String,
    tasks: {
        type: [
            {
                staffId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
                title: String,
                description: String,
                deadline: Date,
                completed: Boolean,
                completedAt: Date,
            },
        ],
        default: [],
    },
    deadline: Date,
    status: {
        type: String,
        enum: ["pending", "working", "done", "cancelled"],
        default: "pending",
    },
    completedAt: Date,
});

module.exports = projectSchema;
