const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/unauthenticated");

const register = async (req, res) => {
    // we are getting the body object and right away initiating the create query.
    const user = await User.create({ ...req.body }); // we are counting on mongoose for validation
    // middleware kicks in

    // middleware kicks out
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token: user.createJWT(), success: true }); // using the instance method
};
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new BadRequestError('add email and password');
    const user = await User.findOne({ email });
    if (!user) throw new UnauthenticatedError('no user found with that email');
    // using the instance
    const isPasswordCorrect = await user.comparePasswords(password);
    if (!isPasswordCorrect) throw new UnauthenticatedError('wrong password');
    res.status(StatusCodes.OK).json({ token: user.createJWT(), user: { name: user.name } });
};

module.exports = {
    register,
    login
}