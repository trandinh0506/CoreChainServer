const projectModel = require("../Models/project.Model");
const userModel = require("../Models/user.Model");

class AdminService {
    async createProject(project) {
        try {
            const { managerId, projectName, deadline, description } = project;

            if (!managerId || !projectName || !deadline || !description) {
                return { status: 400, message: "Missing required fields" };
            }

            const newProject = new projectModel({
                managerId,
                projectName,
                description,
                deadline,
            });

            const savedProject = await newProject.save();

            return {
                success: true,
                message: {
                    message: "Project created successfully",
                    data: savedProject.id,
                },
            };
        } catch (error) {
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
