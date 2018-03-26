const mongoose = require('mongoose');
const _ = require('lodash');

var PolicySchema = new mongoose.Schema({
  agency: {
    type: Object,
    require: true
  },
  customer: {
    type: Object,
    require: true
  },
  product: {
    type: Object,
    require: true
  },
  mainDecay: {
    type: Object,
    require: true
  },
  paymentMethod: {
    type: Object,
    require: true
  },
  validFrom: {
    type: String,
    require: true
  },
  payer: {
    type: Object,
    require: true
  },
  whiteLabel: {
    type: Object,
    require: true
  },
  policyContractPeriod: {
    type: Object,
    require: true
  },
  policyParameterValues: {
    type: Array
  },
  _id: false
});

var Policy = mongoose.model('Policy', PolicySchema);

module.exports = {Policy}
