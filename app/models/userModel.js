var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  firstName: { 
    type: String,
    require: [true, "First name must be minimum 2 characters"],
    trim: true,
    minlength: 2
  },
  lastName: {
    type: String,
    require: [true, "Last name must be minimum 2 characters"],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, "Email must be valid"],
    minlength: 5,
    trim: true
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;