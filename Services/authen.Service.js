const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10; // cost factor

class authentication {
    async login(data) {
        const { username, password } = data;
        if (!(await isExsitedUser(username))) {
            return { status: 404, message: "User not found" };
        }
        const { hashedPassword, userId, role } = await getUserInfo(username);
        if (await bcrypt.compare(password, hashedPassword)) {
            return { status: 401, message: "Password is incorrect" };
        }
        return {
            status: 200,
            message: {
                message: "Login successful",
                accessToken: this.createAccessToken(userId, role),
                refreshToken: this.createRefreshToken(userId, role),
            },
        };
    }
    async register(data) {}
    createAccessToken(userId, role) {
        return jwt.sign({ userId, role }, process.env.SECRET_KEY, {
            expiresIn: "3m",
        });
    }
    createRefreshToken(userId, role) {
        return jwt.sign({ userId, role }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
    }
    validate(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            return { isSuccess: true, decoded };
        } catch (err) {
            return { isSuccess: false, decoded: err };
        }
    }
    async isExsitedUser(username) {}
    async getUserInfo(username) {}
}

module.exports = new authentication();
