const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var CustomerSchema = new mongoose.Schema({
  primaryEmail: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  name: {
    type: String,
    require: true
  },
  ssn: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  address1: {
    type: String,
    required: true
  },
  status: {
    enumName: String,
    code: String
  },
  type: {
    enumName: String,
    code: String
  },
  _id: false
});

var Customer = mongoose.model('Customer', CustomerSchema);

module.exports = {Customer}
