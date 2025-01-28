const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../Models/user.Model");

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = "3m";
const REFRESH_TOKEN_EXPIRY = "1h";

class Authentication {
    async login(data) {
        const { username, password } = data;
        console.log(username, password);
        try {
            const user = await this.getUser(username);
            if (!user) {
                return { status: 404, message: "User not found" };
            }

            const { password: hashedPassword, _id: userId, role } = user;
            const isPasswordValid = await bcrypt.compare(
                password,
                hashedPassword
            );
            if (!isPasswordValid) {
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
        } catch (err) {
            return {
                status: 500,
                message: "Internal server error",
                error: err.message,
            };
        }
    }

    async register(data) {
        const { username, password, email, phone, role } = data;
        console.log(data);
        try {
            if (await this.isExisted("username", username)) {
                return { status: 409, message: "Username already exists" };
            }
            if (await this.isExisted("email", email)) {
                return { status: 409, message: "Email already exists" };
            }
            if (await this.isExisted("phone", phone)) {
                return { status: 409, message: "Phone number already exists" };
            }

            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            const newUser = new userModel({
                username,
                email,
                phone,
                password: hashedPassword,
                role,
            });

            await newUser.save();
            return { status: 201, message: "User registered successfully" };
        } catch (error) {
            return {
                status: 500,
                message: "Internal server error",
                error: error.message,
            };
        }
    }

    createAccessToken(userId, role) {
        return jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        });
    }

    createRefreshToken(userId, role) {
        return jwt.sign({ userId, role }, process.env.JWT_SECRET_KEY, {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        });
    }

    validate(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            return { isSuccess: true, decoded };
        } catch (err) {
            return { isSuccess: false, error: err.message };
        }
    }

    async isExisted(field, value) {
        try {
            const query = {};
            query[field] = value;
            const result = await userModel.findOne(query);
            return !!result;
        } catch (err) {
            throw new Error(`Error checking ${field}: ${err.message}`);
        }
    }

    async getUser(username) {
        try {
            return await userModel.findOne({ username });
        } catch (err) {
            throw new Error(`Error fetching user: ${err.message}`);
        }
    }
}

module.exports = new Authentication();
