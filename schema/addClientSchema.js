const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    companyName: {type:"string", required: true},
    url: {type:"string"},
    address1: {type:"string", required: true},
    address2: {type:"string"},
    country: {type:"string", required: true},
    state: {type:"string"},
    city: {type:"string"},
    zip: {type:"string", required: true},
    industry: {type:"string", required: true},
    companySize: {type:"string"},
    linkedIn: {type:"string"},
    networth: {type:"string"}
});

const addClient = mongoose.model('addClient', clientSchema);

module.exports = addClient;