const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {type:"string", required: true},
  reportsTo: {type:"string"},
  designation: {type:"string", required: true},
  department: {type:"string", required: true},
  bloodGroup: {type:"string"},
  dateOfJoining: {type: "string"},
  workType: {type:"string"},
  annual_ctc: {type: "string"},
  officeEmail: {type:"string" ,required: true,
  unique: true},
  otp: {type: String },
  createdAt: {type: Date, default: Date.now, expires: '5m'},// Automatically delete documents after 5 minutes
  workLocation: {type:"string"},
  mobileNo: {type: Number,required: true},
  personal_Email: {type:"string"},
  gender: {type:"string"},
  native: {type:"string"},
  enterCode: {type:"string",required: true},
  enterPassword: {type:"string", required: true, unique: true},
  role: {type: "string",required: true},
  photo: {type: "string"}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
