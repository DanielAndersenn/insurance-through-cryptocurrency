require('./config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const ibsuite = require('./interfaces/ibsuite');
const path = require('path');

var {Customer} = require('./models/iba_customer_model');
var {Policy} = require('./models/iba_policy_model');

var app = express();
const port = process.env.PORT;

app.use('/', express.static(`${__dirname}/client/public`));
app.use(bodyParser.json());

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '/client/public', 'index.html'));
  });

app.post('/customer', (req, res) => {
  winston.log('info', '/customer endpoint Started');

  //Grab relevant parameters from body of request
  var customer = new Customer({
    primaryEmail: req.body.email,
    name: req.body.name,
    ssn: req.body.cpr,
    address1: req.body.address,
    type: {enumName: 'CUSTOMER_TYPE', code: '1'},
    status: {enumName: 'CUSTOMER_STATUS', code: '2'}
  });

  var result = ibsuite.createCustomer(customer);

  result.then((result) => {
    winston.log('info', 'Received success response from IBSuite');
    res.send(result);
  }, (error) => {
    winston.log('info', 'Received error response from IBSuite');
    res.send(error);
  });


});

app.post('/policy', (req, res) => {
  winston.log('info', '/policy endpoint Started');

  var date = new Date().toJSON();
  var pcTypeCode = (req.body.type === "Desktop") ? '1': '2';
  var cost = Number(req.body.cost);
  //var selfBuilt = (req.body.selfBuilt);

  winston.log('Value of req.body.selfBuilt: ' + req.body.selfBuilt);
  winston.log('Value of req.body.type: ' + req.body.type);
  winston.log('Value of req.body.cost: ' + req.body.cost);
  winston.log('Value of req.body.customerSerial: ' + req.body.customerSerial);

  //Grab relevant parameters from body of request
  var policy = new Policy({  
    agency: {agencyName: 'IBApplications', agencyNo: 101, serial: '1661010000000001'},
    customer: {serial: req.body.customerSerial},
    product: {name: 'PC_Insurance', serial: '1681010000000003'},
    mainDecay: {serial: '1351000000000101'},
    paymentMethod: {serial: '1351000000000098'},
    validFrom: date,
    payer: {serial: req.body.customerSerial},
    whiteLabel: {serial: '1641010000000002'},
    policyContractPeriod: {enumName: 'POLICY_CONTRACT_PERIOD', code: '12'},
    policyParameterValues: [{name: 'PC_SERIAL', type: 'STRING', value: 'TEST_SERIAL'},
                            {name: 'INDIVIDUAL_PARTS_COVER', type: 'BOOLEAN', value: true},
                            {name: 'DATE_OF_PURCHASE', type: 'DATE', value: date},
                            {name: 'COST', type: 'DOUBLE', value: cost},
                            {name: 'MODEL', type: 'STRING', value: req.body.model},
                            {name: 'TYPE', type: 'ID', enumName: 'PC_TYPE', code: pcTypeCode},
                            {name: 'SELFBUILT', type: 'BOOLEAN', value: true}]
  });

  var result = ibsuite.createPolicy(policy);

  result.then((result) => {
    winston.log('info', 'Received success response from IBSuite');
    res.send(result);
  }, (error) => {
    winston.log('info', 'Received error response from IBSuite');
    res.send(error);
  });


});

app.put('/calculatePolicy', (req, res) => {

  var result = ibsuite.calculatePolicy(req.body.policySerial);

  result.then((result) => {
    winston.log('info', 'Received success response from IBSuite');
    res.send(result);
  }, (error) => {
    winston.log('info', 'Received error response from IBSuite');
    res.send(error);
  });

});

app.listen(port, () => {
  winston.log('info', `Started up server.js on port ${port}`);
});

module.exports = {app};
