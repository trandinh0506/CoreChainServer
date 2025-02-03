const authenService = require("../Services/authen.Service");
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
                secure: true,
                sameSite: "none",
                maxAge: ACCESS_TOKEN_MAX_AGE,
            });
            res.cookie("refreshToken", result.message.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: REFRESH_TOKEN_MAX_AGE,
            });
            res.status(result.status).json(result.message.role);
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
    async isAuthenticated(req, res) {
        try {
            const accessToken = req.cookies.accessToken;
            console.log("isAuthenticated", accessToken);
            if (!accessToken) {
                return res.status(401).json({ isAuthenticated: false });
            }
            const { isSuccess, decoded } = authenService.validate(accessToken);
            console.log(isSuccess, decoded);
            if (isSuccess)
                return res.status(200).json({
                    isAuthenticated: true,
                    user: { userId: decoded.userId, role: decoded.role },
                });
        } catch (err) {
            return res.status(401).json({ isAuthenticated: false });
        }
    }
}

module.exports = new authController();
