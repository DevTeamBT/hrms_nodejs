const mongoose = require('mongoose');

const clientReqSchema = new mongoose.Schema({
    selectClient: {type:"string"},
    selectContact: {type:"string"},
    title: {type:"string"},
    priority: {type:"string"},
    skillSet: {type:"string"},
    mustHave: {type:"string"},
    goodToHave: {type:"string"},
    rangeMin: {type:"string"},
    rangeMax: {type:"string"},
    budgetMin: {type:"string"},
    budgetMax: {type:"string"},
    noOfPositions: {type:"string"},
    location: {type:"string"},
    hireType: {type:"string"},
    workType: {type:"string"},
    recruiter: {type:"string"},
    accManager: {type:"string"}
});

const clientRequirement = mongoose.model('clientRequirement', clientReqSchema);

module.exports = clientRequirement;