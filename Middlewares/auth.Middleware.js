module.exports.authMdw = (req, res, next) => {
    const skipRoutes = ["/login", "/register"];
    console.log(req.path);
    if (skipRoutes.includes(req.path)) {
        return next();
    }
    const token =
        req.headers.authorization?.split(" ")[1] || req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Missing authorization token" });
    }
    const { isSuccess, decoded } = authen.validate(token);
    if (!isSuccess) {
        return res.status(401).json({ message: "Invalid authorization token" });
    }
    // Attach user data to the request for later use
    req.user = decoded;
    next();
};
