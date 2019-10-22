const mongoose = require('mongoose');

//Define how your data looks like




const LoginSchema = mongoose.Schema({
  username: {
    type: String,
    required: 'Please provide the username'
  },
  user_type: {
    type: String,
    enum: ['client', 'admin'],
    default: "client"
  },
  password: {
    type: String,
    required: 'Please provide the password'
  },
  confirm_password: {
    type: String,
    required: "Please provide the confirm password."
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required'
  }
});

// function that validate the password and confirm password
function passwordConfirm(value) {
  // `this` is the mongoose document
  return this.password == value;
}

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};
module.exports = mongoose.model('Login', LoginSchema);