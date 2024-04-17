const { date } = require('joi');
const mongoose = require('mongoose');

const addTaskSchema = new mongoose.Schema({
  //taskId: {type: String,required: true,unique: true },
  taskTitle: {type:"string", required: true},
  description: {type:"string"},
  addTeam: {type: [String], required: true},
  comments: [{
    text: {type: [String], required: true},
    createdAt: {
        type: Date,
        default: Date.now // Automatically set to the current timestamp when a new document is created
    }
}],
  //addTimeStamp :{type:date}
  createdAt: {
    type: Date,
    default: Date.now // Automatically set to the current timestamp when a new document is created
  }
});

const addTask = mongoose.model('addTask', addTaskSchema);

module.exports = addTask;
