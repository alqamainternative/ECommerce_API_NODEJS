const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { UserErrorHandler } = require("../utils/errorHandler");

const getUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ error: "Server has been down." });
    }
}

const addUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).send(user);
    } catch (error) {
        error = UserErrorHandler(error);
        res.status(error.status).send(error);
    }
}

const updateUser = (req, res) => {
    const allowUpdate = ["name", "password", "age"];
    const updateValue = Object.keys(req.body)
    const isValidUpdate = updateValue.every(updateVal => allowUpdate.includes(updateVal));
    if(!isValidUpdate){
        return res.status(400).send({ message: "Invalid Update" });
    }
}
const signupUser = (req, res) => {
    
}

const signinUser = async (req, res, next) => {
    if(!req.body.email || !req.body.password){
        return res.status(400).send({ message: "Please Provide email and password" });
    }
    try {
        const { user , error } = await User.findByCredential(req.body.email, req.body.password, next);
        if(error){
            return res.status(error.status).send({ message: error.message });
        }
        const token = await user.generateAuthToken();
        // req.token = token;
        // req.user = user;
        res.status(200).send({ user: user, token });
    } catch (error) {
        res.status(500).send(error);
    }

}



module.exports = {
    getUser,
    addUser,
    updateUser,
    signinUser,
    signupUser
}