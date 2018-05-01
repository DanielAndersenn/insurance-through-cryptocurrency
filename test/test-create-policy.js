const ibsuite = require('.././interfaces/ibsuite');

var {Policy} = require('.././models/iba_policy_model');

var date = new Date();

date = date.toJSON();

console.log(date);

var policy = new Policy({
  agency: {agencyName: 'IBApplications', agencyNo: 101, serial: '1661010000000001'},
  customer: {serial: '1011010000000102'},
  product: {name: 'PC_Insurance', serial: '1681010000000003'},
  mainDecay: {serial: '1351000000000101'},
  paymentMethod: {serial: '1351000000000098'},
  validFrom: date,
  payer: {serial: '1011010000000084'},
  whiteLabel: {serial: '1641010000000002'},
  policyContractPeriod: {enumName: 'POLICY_CONTRACT_PERIOD', code: '12'},
  policyParameterValues: [{name: 'PC_SERIAL', type: 'STRING', value: 'TEST_SERIAL'},
                          {name: 'INDIVIDUAL_PARTS_COVER', type: 'BOOLEAN', value: true},
                          {name: 'DATE_OF_PURCHASE', type: 'DATE', value: date},
                          {name: 'COST', type: 'DOUBLE', value: 10000},
                          {name: 'MODEL', type: 'STRING', value: 'HP|WHATEVER'},
                          {name: 'TYPE', type: 'ID', enumName: 'PC_TYPE', code: '1'},
                          {name: 'SELFBUILT', type: 'BOOLEAN', value: true}]
});

var result = ibsuite.createPolicy(policy);

result.then((result) => {
  console.log('info', 'Received success response from IBSuite');
  console.log(result);
}, (error) => {
  console.log('info', 'Received error response from IBSuite');
  console.log(error);
});

console.log(policy);
// type: {enumName: 'CUSTOMER_TYPE', code: '1'},
// status: {enumName: 'CUSTOMER_STATUS', code: '2'}
