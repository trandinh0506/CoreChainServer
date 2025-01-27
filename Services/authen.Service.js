const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../Models/user.Model");
const SALT_ROUNDS = 10; // cost factor

class authentication {
    async login(data) {
        const { username, password } = data;
        if (!(await isExsitedUser(username))) {
            return { status: 404, message: "User not found" };
        }
        const { hashedPassword, userId, role } = await getUser(username);
        if (!(await bcrypt.compare(password, hashedPassword))) {
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
    async register(data) {
        const { username, password, email, phone, role } = data;

        if (await isExsitedUser(username)) {
            return { status: 409, message: "Username had already existed" };
        }
        if (await this.isExsitedEmail(email)) {
            return { status: 409, message: "Email had already existed" };
        }
        if (await this.isExsitedPhone(phone)) {
            return { status: 409, message: "Phone number had already existed" };
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({
            username,
            email,
            phone,
            password: hashedPassword,
            role,
        });
        // validate email and phone here before adding new user to database
        try {
            await newUser.save();

            return {
                status: 201,
                message: "User registered successfully",
            };
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
            };
        }
    }
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
    async isExsitedEmail(email) {}
    async getUser(username) {}
}

module.exports = new authentication();
