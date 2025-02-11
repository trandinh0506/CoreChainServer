const userModel = require("../Models/user.Model");
const projectModel = require("../Models/project.Model");
class CommonService {
    async getProfile(userId) {
        try {
            const user = await userModel.findById(userId).select("-password");
            return { status: 200, user };
        } catch (err) {
            return {
                status: 500,
                message: "Internal Server Error",
                err: err.message,
            };
        }
    }
    async getAllTasks(projectId) {
        try {
            const project = await projectModel
                .findById(projectId)
                .select("tasks")
                .lean();

            return { status: 200, tasks: project.tasks || [] };
        } catch (err) {
            return { status: 500, message: err.message };
        }
    }
    async updateProfile(userId, profile) {
        try {
            const { fullName, address, birthday, identifiNumber } = profile;

            const updateData = {};
            if (fullName) updateData.fullName = fullName;
            if (address) updateData.address = address;
            if (birthday) updateData.birthday = birthday;
            if (identifiNumber) updateData.identifiNumber = identifiNumber;

            if (Object.keys(updateData).length === 0) {
                return { status: 400, message: "No valid fields to update" };
            }

            await userModel.findByIdAndUpdate(userId, {
                $set: updateData,
            });

            return { status: 200, message: "Profile updated successfully" };
        } catch (error) {
            return {
                status: 500,
                message:
                    error.message || "An error occurred while updating profile",
            };
        }
    }
}

module.exports = new CommonService();
