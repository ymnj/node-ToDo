const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

//Determines what gets sent back when a mongoose model is converted to JSON value
//.methods are instance methods
userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'userName', 'firstName', 'lastName', 'email']);
}

userSchema.methods.generateAuthToken =  function (){
  let access = 'auth';
  let token = jwt.sign({_id: this._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  this.tokens.push({access, token});

  return this.save().then(() => {
    return token;
  });
};

userSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  });
}

// .static are model methods
userSchema.statics.findByToken = function(token) {
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return this.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
}

userSchema.statics.findByCredentials = function(email, password) {

  return this.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          resolve(user)
        }else{
          reject();
        }
      });
    });
  });
};



userSchema.pre('save', function(next){
  let user = this;

  if(user.isModified('password')){

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash
        next();
      });
    });
  } else {
    next();
  }
})

let User = mongoose.model('User', userSchema);

module.exports = User;