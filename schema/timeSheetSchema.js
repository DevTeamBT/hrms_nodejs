const mongoose = require('mongoose');

const timeSheetSchema = new mongoose.Schema({
  taskTitle: {type:"string"},
  addTeam: {type:"string"},
  description: {type:"string"},
  comment: {type:"string"}
});

const timeSheet = mongoose.model('timeSheet', timeSheetSchema);

module.exports = timeSheet;
