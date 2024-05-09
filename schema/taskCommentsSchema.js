
const mongoose = require('mongoose');

const addCommentsSchema = new mongoose.Schema({
    // postId: { type: String, required: true },
        text: { type: String, required: true },
        commentedBy: { type: mongoose.Schema.Types.String, ref: 'User' }, // references to User schema
        task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'addTask' }, //  task_id references to addTask schema
        createdAt: { type: Date, default: Date.now }
   
  
});

const addComments = mongoose.model('addComments', addCommentsSchema);

module.exports = addComments;





