const authService = require("../Services/authen.Service");

class authController {
    async login(req, res) {
        const data = req.body.data;
        const result = await authService.login(data);
        console.log(result);
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
