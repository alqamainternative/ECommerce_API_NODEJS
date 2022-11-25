const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_AUTH_KEY);
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token });
        if(!user){
            return res.status(401).send({ message: "Please Login First"});
        }
        // console.log(decoded);
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).send({ message: "You are not Authorized"});
    }
}

module.exports = auth;