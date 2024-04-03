const mongoose = require('mongoose');
const User = require('../schema/userSchema'); 
const addClient = require('../schema/addClientSchema');

async function createUser(userData) {
  try {
    const newUser = new User(userData);
    await newUser.save();
  } catch (error) {
    throw new Error('Error saving user data to MongoDB.');
  }
}


module.exports = { createUser };
