const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
// To parse request body to type json
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// To display user friendly error messages
const expressValidator = require('express-validator');
// To use environment varibles of env file
require('dotenv').config();
// importing and using user routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');

//app
const app = express()

//db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB Connected'));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//using routes as middel ware
app.use("/api",authRoutes);
app.use("/api",userRoutes);
app.use("/api",categoryRoutes);
app.use("/api",productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);


// process is similar to kind document which we have in browser and we are accessing PORT from .env file
const port = process.env.PORT || 8000

app.listen(port, () =>{
	console.log(`My server is listeninig on port: ${port} `)
})