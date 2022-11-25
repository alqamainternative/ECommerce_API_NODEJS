require('dotenv').config();
require('./db/mongoose');
const express = require("express");
const products = require('./routes/products');
const category = require('./routes/category');
const users = require('./routes/users');
const order = require('./routes/order');


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', users);
app.use('/api/products', products);
app.use('/api/category', category);
app.use('/api/order', order);

// app.use((error, req, res, next) => {
//     res.send(error);
// });



const port = process.env.PORT || 5000;
app.listen(port, (err) => {
    if(err){
        return console.log(err);
    }
    console.log(`Server is running on http://localhost:${port}`);
});