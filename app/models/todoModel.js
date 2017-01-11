var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var todoSchema = new Schema({
  title: {
    type: String,
    required: [true, "Must include a title"],
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    // required: [true, "A description must be minimum 5 characters"],
    minlength: 5,
    trim: true
  },
  isDone: {
    type: String,
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

var Todo = mongoose.model('ToDo', todoSchema);

module.exports = Todo;