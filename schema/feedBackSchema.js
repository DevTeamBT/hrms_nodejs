
const mongoose = require('mongoose');

const feedBackSchema = new mongoose.Schema({
    
        managerName: { type: String, required: true },
        employeeName: { type: String, required: true },
        responses: [{
            question: { type: String },
            // answer: { type: Number }
            options:[{ label:{ type: String }, value:{ type: String } }]
          }]
});

const addFeedBack = mongoose.model('addFeedBack', feedBackSchema);

module.exports = addFeedBack;
