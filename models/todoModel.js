var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var todoSchema = new Schema({
  username: String,
  task: String,
  isDone: Boolean,
  hasAttachment: Boolean
});

var ToDos = mongoose.model('ToDos', todoSchema);

module.exports = ToDos;