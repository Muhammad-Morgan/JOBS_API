const User = require("../models/User");

const jwt = require("jsonwebtoken");

const UnauthenticatedError = require("../errors/unauthenticated");

const authMiddleware = async (req, res, next) => {
    // token should be in the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) throw new UnauthenticatedError('No token provided');

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) throw new UnauthenticatedError('Token invalid');
        const { userId, name } = decoded;
        req["user"] = { userId, name };

        // alt setup if you need the full user details
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await User.findById(decoded.id).select('-password'); // select here selects all fields but password according to the setup
        next();
    } catch (error) {
        throw new UnauthenticatedError('Unauthorized access');
    }
};
module.exports = authMiddleware;