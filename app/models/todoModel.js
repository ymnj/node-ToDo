const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let todoSchema = new Schema({
  title: {
    type: String,
    required: [true, "Must include a title"],
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true,
    minlength: [5, "A description must be minimum 5 characters"],
    trim: true
  },
  isDone: {
    type: Boolean,
    default: false
  },
  hasAttachment: {
    type: Boolean,
    default: null
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// todoSchema.methods.generateAuthToken =  function (){
//   var user = this;
// };

let Todo = mongoose.model('ToDo', todoSchema);

module.exports = Todo;