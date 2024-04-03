const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    selectCompany: {type:"string", required: true},
    selectCountry: {type:"string"},
    selectState: {type:"string"},
    selectCity: {type:"string"},
    firstName: {type:"string", required: true},
    lastName: {type:"string", required: true},
    jobTitle: {type:"string"},
    department: {type:"string"},
    email: {type:"string", required: true},
    mobile: {type:"string", required: true},
    linkedIn: {type:"string"},
    selectSource: {type:"string"}
    });

const clientContact = mongoose.model('clientContact', contactSchema);

module.exports = clientContact;