const authService = require("../Services/authen.Service");
const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 1000;
class authController {
    async login(req, res) {
        const data = req.body.data;
        const result = await authService.login(data);
        console.log(result);
        if (result.status === 200) {
            res.cookie("accessToken", result.message.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: ACCESS_TOKEN_MAX_AGE,
            });
            res.cookie("refreshToken", result.message.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: REFRESH_TOKEN_MAX_AGE,
            });
            res.status(result.status).json(result.message.message);
            return;
        }
        res.status(result.status).json(result.message);
    }
    async register(req, res) {
        const data = req.body.data;
        console.log(req.body);
        const result = await authService.register(data);
        res.status(result.status).json(result.message);
    }
}

module.exports = new authController();
