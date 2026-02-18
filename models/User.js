const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide valid email"],
        unique: true//create a unique index
    },
    password: {
        type: String,
        required: [true, "Passowrd should be at least 6 digits"],
        minlength: 6,
        // maxlength: 12
    },
});
// use good old function. because that way we are binding "this" to the document
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    // what we wanna do before saving the document is to hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// JWT instance method
UserSchema.methods.createJWT = function () {
    return jwt.sign({
        userId: this._id,
        name: this.name,
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
}
// compare password instance
UserSchema.methods.comparePasswords = async function (password) {
    // checking variable
    const isMatch = await bcrypt.compare(password, this.password);
    // return the match
    return isMatch;
}
module.exports = mongoose.model("User", UserSchema);