
const authAdmin = (req, res, next) => {
    if(req.user.isAdmin){
        next();
    }
    else {
        res.status(401).send({ message: "This route is for admin only" });
    }
}


module.exports = authAdmin;