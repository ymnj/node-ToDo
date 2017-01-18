const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 2
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      require: true
    },
    token: {
      type: String,
      require: true
    }
  }],
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
    unique: true,
    minlength: [5, "Email must be minimum 5 characters"],
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: `{value} is not a valid email`
    }

  }
});

userSchema.methods.generateAuthToken =  function (){
  let user = this;
  let access = 'auth';
  let token = jwt.sign({_id: user._id.toHexString(), access}, 'testsecret').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

let User = mongoose.model('User', userSchema);

module.exports = User;