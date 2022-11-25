const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, (err, con) => {
    if(err){
        return console.log(err);
    }
    console.log("Successfully connected to DB -> " + con.name);
});