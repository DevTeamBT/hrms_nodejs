const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {type:"string", required: true},
  reportsTo: {type:"string"},
  designation: {type:"string", required: true},
  department: {type:"string", required: true},
  bloodGroup: {type:"string"},
  dateOfJoining: {type: "string"},
  dateOfBirth: {type: "string"},
  workType: {type:"string"},
  annual_ctc: {type: "string"},
  officeEmail: {type:"string" ,required: true,
  unique: true},
  otp: { type: String, validate: { validator: function(v) { return /^\d{6}$/.test(v); },message: props => `${props.value} is not a valid OTP!`},
  createdAt: {
    type: Date,
    default: Date.now, expires:900}
  },
  workLocation: {type:"string"},
  mobileNo: { type: Number, validate: { validator: function(v) { return /^\d{10}$/.test(v);},message: props => `${props.value} is not a valid 10-digit mobile number!`}},
  personal_Email: {type:"string"},
  gender: {type:"string"},
  native: {type:"string"},
  enterCode: {type:"string",required: true},
  enterPassword: {type:"string", required: true, unique: true},
  role: {type: "string",required: true},
  photo: {type: "string"},
  probationPeriod: {type: "string"},
  confirmationDate: {type: "string"},
  aadharNumber : {type: "string"},
  emergencyContactNumber: {type: "string"},
  fathersName : {type: "string"},
  status : {type: "string"},
  spouseName: {type: "string"},
  division :{type: "string"},
  costCenter:{type: "string"},
  Grade :{type: "string"},
  Location:{type: "string"},
  company:{type: "string"},
  Shift:{type: "string"},
  holidayCategory:{type: "string"},
  panNumber:{type: "string"},
  pfNumber:{type: "string"},
  uanNumber:{type: "string"},
  paymentType:{type: "string"}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
