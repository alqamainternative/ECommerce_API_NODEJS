const route = require("express").Router();
const {getUser, addUser, updateUser, signinUser, signupUser } = require("../controllers/userController");

route.get("/", getUser);
route.post("/", addUser);
route.patch("/", updateUser);


// SignUp & SignIn
route.post("/signin", signinUser);
route.post("/signup", addUser);


module.exports = route;