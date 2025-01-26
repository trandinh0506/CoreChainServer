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
    completed: Boolean,
    completedAt: Date,
});

module.exports = projectSchema;
