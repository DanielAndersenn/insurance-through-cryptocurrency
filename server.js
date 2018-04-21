require('./config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston');
const ibsuite = require('./interfaces/ibsuite');
const path = require('path');
const publicPath = path.join(__dirname, 'client', 'public');

var {Customer} = require('./models/iba_customer_model');
var {Policy} = require('./models/iba_policy_model');

var app = express();
const port = process.env.PORT;

app.use('/', express.static(publicPath));
app.use(bodyParser.json());

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
  
app.post('/api/customer', (req, res) => {
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

app.post('/api/policy', (req, res) => {
  winston.log('info', '/policy endpoint Started');

  winston.log('info', 'Value of req.body.selfBuilt: ' + req.body.selfBuilt);
  winston.log('info', 'Value of req.body.individualParts: ' + req.body.individualParts);

  var date = new Date().toJSON();
  var pcTypeCode = (req.body.type === "Desktop") ? '1': '2';
  var cost = Number(req.body.cost);
  var selfBuilt = req.body.selfBuilt;
  var individualParts = req.body.individualParts;
  var pcSerial = req.body.pcSerial;
  

  winston.log('info', 'Value of req.body.type: ' + req.body.type);
  winston.log('info', 'Value of req.body.cost: ' + req.body.cost);
  winston.log('info', 'Value of req.body.customerSerial: ' + req.body.customerSerial);
  winston.log('info', 'Value of selfBuilt: ' + selfBuilt);
  winston.log('info', 'Value of individualParts: ' + individualParts);

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
    policyParameterValues: [{name: 'PC_SERIAL', type: 'STRING', value: pcSerial},
                            {name: 'INDIVIDUAL_PARTS_COVER', type: 'BOOLEAN', value: individualParts},
                            {name: 'DATE_OF_PURCHASE', type: 'DATE', value: date},
                            {name: 'COST', type: 'DOUBLE', value: cost},
                            {name: 'MODEL', type: 'STRING', value: req.body.model},
                            {name: 'TYPE', type: 'ID', enumName: 'PC_TYPE', code: pcTypeCode},
                            {name: 'SELFBUILT', type: 'BOOLEAN', value: selfBuilt}]
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

app.put('/api/calculatePolicy', (req, res) => {

  winston.log('info', '/calculatePolicy endpoint Started');

  winston.log('info', 'Value of req.body.policySerial: ' + req.body.policySerial);
  winston.log('info', 'Value of req.body.policyParams: ' + req.body.policyParams);

  var ppSerial = req.body.policyParams;

  winston.log('info', 'Value of ppSerial[2].serial: ' + ppSerial[2].serial);

  var date = new Date().toJSON();
  var pcTypeCode = (req.body.type === "Desktop") ? '1': '2';
  var cost = Number(req.body.cost);
  var selfBuilt = req.body.selfBuilt;
  var individualParts = req.body.individualParts;
  var pcSerial = req.body.pcSerial;

  //Grab updated policy params from request body and attach serials
  var newPolicyParams = {data: {policyParameterValues: [
                        {name: 'PC_SERIAL', type: 'STRING', value: pcSerial, serial: ppSerial[4].serial},
                        {name: 'INDIVIDUAL_PARTS_COVER', type: 'BOOLEAN', value: individualParts, serial: ppSerial[5].serial},
                        {name: 'DATE_OF_PURCHASE', type: 'DATE', value: date, serial: ppSerial[6].serial},
                        {name: 'COST', type: 'DOUBLE', value: cost, serial: ppSerial[7].serial},
                        {name: 'MODEL', type: 'STRING', value: req.body.model, serial: ppSerial[8].serial},
                        {name: 'TYPE', type: 'ID', enumName: 'PC_TYPE', code: pcTypeCode, serial: ppSerial[9].serial},
                        {name: 'SELFBUILT', type: 'BOOLEAN', value: selfBuilt, serial: ppSerial[10].serial},
                        ]}
                        };

  

  var result = ibsuite.calculatePolicy(req.body.policySerial, newPolicyParams);

  result.then((result) => {
    winston.log('info', 'Received success response from IBSuite');
    res.send(result);
  }, (error) => {
    winston.log('info', 'Received error response from IBSuite');
    res.send(error);
  });

});

app.put('/api/payPolicy', (req, res) => {

  winston.log('info', '/payPolicy endpoint Started');

  var result = ibsuite.activateCollectPayPolicy(req.body.polSerial, req.body.transactionTimestamp, req.body.transactionLink);

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
