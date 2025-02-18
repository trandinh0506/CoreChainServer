const projectModel = require("../Models/project.Model");
const userModel = require("../Models/user.Model");
const moment = require("moment");
class AdminService {
    async createProject(project) {
        try {
            const { managerId, projectName, deadline, description } = project;

            if (!managerId || !projectName || !deadline || !description) {
                return { status: 400, message: "Missing required fields" };
            }

            const deadlineDate = moment(deadline, "DD-MM-YYYY").toDate();
            if (isNaN(deadlineDate)) {
                console.log("Invalid date", deadlineDate);
                return { status: 400, message: "Invalid date" };
            }

            const newProject = new projectModel({
                managerId,
                projectName,
                description,
                deadlineDate,
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
