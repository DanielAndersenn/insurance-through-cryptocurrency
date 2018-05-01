const ibsuite = require('./interfaces/ibsuite');

var {Customer} = require('./models/iba_customer_model');

var customer = new Customer({
  primaryEmail: 'emilia@hotmail.com',
  name: 'Emilia Hammer',
  ssn: '25215212',
  address1: 'Testvej 1',
  type: {enumName: 'CUSTOMER_TYPE', code: '1'},
  status: {enumName: 'CUSTOMER_STATUS', code: '2'}
});

ibsuite.createCustomer(customer);

console.log(customer);
// type: {enumName: 'CUSTOMER_TYPE', code: '1'},
// status: {enumName: 'CUSTOMER_STATUS', code: '2'}
