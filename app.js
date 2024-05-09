const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');
const userRoute = require('./router/router'); 
const User = require('./schema/userSchema'); 
//const link = require('./link')
const cors = require('cors');
//const path = require('../signup/signup_page.html');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
//app.use(bodyParser.json());
app.use(express.json());
app.set('view engine', 'ejs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb+srv://madabhavipriyanka62:venwkNcLMK3gjCOr@cluster0.0n9xq0f.mongodb.net/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});
//Storing Timestamps only time in Databases using Mongoose  
const now = new Date();
//const expiresIn = now.setDate(now.getDate() + 1); 


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Use the userRoute for handling user-related routes
app.use(userRoute);



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
