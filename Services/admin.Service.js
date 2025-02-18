const projectModel = require("../Models/project.Model");
const userModel = require("../Models/user.Model");
const moment = require("moment");
const { toUTC } = require("../utils/datatime");
class AdminService {
    async createProject(project) {
        try {
            const { managerId, projectName, deadline, description } = project;

            if (!managerId || !projectName || !deadline || !description) {
                return { status: 400, message: "Missing required fields" };
            }

            const deadlineDate = toUTC(deadline);
            if (isNaN(deadlineDate)) {
                return { status: 400, message: "Invalid date" };
            }

            const newProject = new projectModel({
                managerId,
                projectName,
                description,
                deadline: deadlineDate,
            });

            const savedProject = await newProject.save();

            return {
                status: 201,
                message: {
                    message: "Project created successfully",
                    data: savedProject.id,
                },
            };
        } catch (error) {
            console.log("create project", error);
            return {
                status: 500,
                message:
                    error.message ||
                    "An error occurred while creating the project",
            };
        }
    }
    async getProjects() {
        try {
            const projects = await projectModel.find();

            if (projects.length === 0) {
                return {
                    status: 204,
                    message: {
                        message: "No projects found",
                        data: [],
                    },
                };
            }

            return {
                status: 200,
                message: {
                    message: "Projects retrieved successfully",
                    data: projects,
                },
            };
        } catch (error) {
            return {
                status: 500,
                message: error.message || "Internal Server Error",
            };
        }
    }

    async editProject(projectId, data) {
        try {
            if (!projectId) {
                return { status: 400, message: "Project ID is required" };
            }

            const project = await projectModel.findById(projectId);
            if (!project) {
                return { status: 404, message: "Project not found" };
            }

            if (project.status === "completed") {
                return {
                    status: 400,
                    message: "Cannot edit a completed project",
                };
            }

            const allowedUpdates = [
                "projectName",
                "description",
                "deadline",
                "managerId",
            ];
            const updateData = {};

            for (const key of allowedUpdates) {
                if (updates[key] !== undefined) {
                    updateData[key] = data[key];
                }
            }

            if (updateData.deadline) {
                const deadlineDate = moment
                    .utc(updateData.deadline, "DD-MM-YYYY")
                    .startOf("day")
                    .toDate();
                if (isNaN(deadlineDate)) {
                    return { status: 400, message: "Invalid date format" };
                }
                updateData.deadline = deadlineDate;
            }

            await projectModel.findByIdAndUpdate(projectId, {
                $set: updateData,
            });

            return { status: 200, message: "Project updated successfully" };
        } catch (error) {
            console.log("editProject error", error);
            return {
                status: 500,
                message:
                    error.message ||
                    "An error occurred while updating the project",
            };
        }
    }

    async getManagers() {
        try {
            const managers = await userModel
                .find({ role: "manager" })
                .select("_id fullName");

            if (managers.length === 0) {
                return {
                    status: 204,
                    message: {
                        message: "No manager found",
                        data: [],
                    },
                };
            }

            return {
                status: 200,
                message: {
                    message: "Managers retrieved successfully",
                    data: managers,
                },
            };
        } catch (error) {
            return {
                status: 500,
                message: error.message || "Internal Server Error",
            };
        }
    }
}

module.exports = new AdminService();
