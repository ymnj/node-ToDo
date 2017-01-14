const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2
  },
  firstName: { 
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Last name must be minimum 2 characters"]
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, "Last name must be minimum 2 characters"]
  },
  email: {
    type: String,
    required: true,
    minlength: [5, "Email must be minimum 5 characters"],
    trim: true
  }
});

let User = mongoose.model('User', userSchema);

module.exports = User;