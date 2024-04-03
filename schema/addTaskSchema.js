const mongoose = require('mongoose');

const addTaskSchema = new mongoose.Schema({
  taskTitle: {type:"string", required: true},
  description: {type:"string"},
  addTeam: {type:"string", required: true}
});

const addTask = mongoose.model('addTask', addTaskSchema);

module.exports = addTask;
