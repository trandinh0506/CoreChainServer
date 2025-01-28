const authen = require("../Services/authen.Service");
module.exports.authMdw = (req, res, next) => {
    const skipRoutes = ["/login", "/register"];
    if (skipRoutes.includes(req.path)) {
        return next();
    }
    console.log(req.cookies);
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
        return res.status(401).json({ message: "Missing authorization token" });
    }
    const { isSuccess, decoded } = authen.validate(accessToken);
    if (!isSuccess) {
        return res.status(401).json({ message: "Invalid authorization token" });
    }

    // Attach user data to the request for later use
    req.user = decoded;
    next();
};
