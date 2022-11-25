const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: function(email){
            if(!validator.isEmail(email)){
                throw new Error("Please Provide a valid Email Address");
            }
        }
    },
    age: {
        type: Number,
        // required: true,
        validate: function(num){
            if(num <= 0){
                throw new Error("Age can not be negative or zero");
            }
        }
    },
    password: {
        type: String,
        required: true,
        min: 8,
        validate: function(pass){
            const isStrong = validator.isStrongPassword(pass, {
                minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1
            })
            if(!isStrong){
                // throw new Error("Password must containt atleast one small letter, capital letter and a special symbol");
                if(!(/[A-Z]/.test(pass))){
                    throw new Error("Password must containt atleast one capital letter");
                }
                else if(!(/[a-z]/.test(pass))){
                    throw new Error("Password must containt atleast one small letter");
                }
                else if(!(/[0-9]/.test(pass))){
                    throw new Error("Password must containt atleast one number");
                }
                else {
                    throw new Error("Password must containt atleast one special symbol");
                }
            }
        }
    },
    avatar: {
        type: Buffer
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isConfirm: {
        type: Boolean,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
});

userSchema.pre("save", async function(next){
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.toJSON = function(){
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.isAdmin;
    delete userObject.isConfirm;
    delete userObject.avatar;
    return userObject;
}

userSchema.statics.findByCredential = async (email, password, next) => {
    const error = {};
    const user = await User.findOne({ email });
    if(!user) {
        error.status = 404;
        error.message = "User Not Found";
    };
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        error.status = 400;
        error.message = "Credential does not match";
        return { user: null, error };
    };
    return { user, error:null };
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString(), isAdmin: this.isAdmin }, process.env.JWT_AUTH_KEY);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;