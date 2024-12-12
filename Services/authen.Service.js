const jwt = require("jsonwebtoken");

class authentication {
    async login() {}
    async createToken(userId, role) {}
    validate(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            return { isSuccess: true, decoded };
        } catch (err) {
            return { isSuccess: false, decoded: err };
        }
    }
}

module.exports = new authentication();
