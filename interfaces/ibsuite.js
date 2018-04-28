var config = require('./../config');

const request = require('request');
const winston = require('winston');

var credentials = '101|rest_user:60E8467C33C9A24918C79DBD611BE880';
//var credentials = '101|danand:820DE13999420446B33523F0D251D219';

var createCustomer = (customer) => {

  return new Promise((resolve, reject) => {

  winston.log('info', 'begin createCustomer');

  winston.log('info', 'JSON.stringify(customer): ' + JSON.stringify(customer));

  request({
    headers: generateAuthHeader(),
    url: 'https://101danand.ibapps.dk/101danand/rest/v1/customers',
    method: 'POST',
    body: JSON.stringify(customer)
  }, (error, response, body) => {
      winston.log('info', 'Value of error: ' + error);
      winston.log('info', 'Value of response: ' + response);
      winston.log('info', 'Value of body: ' + body);

      var resultObj;
      var statusCode = response.statusCode;
      winston.log('info', '### STATUS CODE ' + response.statusCode + ' ###');

      if(body && statusCode == '201')
      {
        resultObj = JSON.parse(body);
        winston.log('info', "Customer created: " + resultObj);
        resolve(resultObj);
      } else {
        resultObj = JSON.parse(body);
        winston.log('info', "Error " + resultObj.message);
        reject (resultObj.message);
      }
    });

  });
};

var createPolicy = (policy) => {
  return new Promise((resolve, reject) => {

  winston.log('info', 'begin createPolicy');

  winston.log('info', 'JSON.stringify(policy): ' + JSON.stringify(policy));

  request({
    headers: generateAuthHeader(),
    url: 'https://101danand.ibapps.dk/101danand/rest/v1/policies',
    method: 'POST',
    body: JSON.stringify(policy)
  }, (error, response, body) => {
      winston.log('info', 'Value of error: ' + error);
      winston.log('info', 'Value of response: ' + response);
      winston.log('info', 'Value of body: ' + body);

      var resultObj;
      var statusCode = response.statusCode;
      winston.log('info', '### STATUS CODE ' + response.statusCode + ' ###');

      if(body && statusCode == '201')
      {
        resultObj = JSON.parse(body);
        winston.log('info', "Policy created: " + resultObj);
        resolve(resultObj);
      } else {
        resultObj = JSON.parse(body);
        winston.log('info', "Error " + resultObj.message);
        reject (resultObj.message);
      }
    });
  });
}

var calculatePolicy = (polSerial, policyParams) => {
  return new Promise((resolve, reject) => {

  winston.log('info', 'begin calculatePolicy');

  winston.log('info', 'Value of polSerial: ' + polSerial);
  winston.log('info', 'Value of policyParams: ' + JSON.stringify(policyParams));

  request({
    headers: generateAuthHeader(),
    url: 'https://101danand.ibapps.dk/101danand/rest/v1/policies/' + polSerial + '?event=calculate&invoke=2',
    method: 'PUT',
    body: JSON.stringify(policyParams)
  }, (error, response, body) => {
      winston.log('info', 'Value of error: ' + error);
      winston.log('info', 'Value of response: ' + response);
      winston.log('info', 'Value of body: ' + body);

      var resultObj;
      var statusCode = response.statusCode;
      winston.log('info', '### STATUS CODE ' + response.statusCode + ' ###');

      if(body && statusCode == '200')
      {
        resultObj = JSON.parse(body);
        winston.log('info', "Policy calculated: " + resultObj);
        resolve(resultObj);
      } else {
        resultObj = JSON.parse(body);
        winston.log('info', "Error " + resultObj.message);
        reject (resultObj.message);
      }

    });
  });
}

var activateCollectPayPolicy = (polSerial, transactionLink) => {
  return new Promise((resolve, reject) => {

  winston.log('info', 'begin activateCollectPayPolicy');

  winston.log('info', 'Value of polSerial: ' + polSerial);

  request({
    headers: generateAuthHeader(),
    url: 'https://101danand.ibapps.dk/101danand/rest/v1/json/callJSON?operation=activateCollectPayPolicy',
    method: 'PUT',
    body: '{"policySerial": "' + polSerial + '", "transactionLink": "' + transactionLink + '"}'
  }, (error, response, body) => {
      winston.log('info', 'Value of error: ' + error);
      winston.log('info', 'Value of response: ' + response);
      winston.log('info', 'Value of body: ' + body);

      var resultObj;
      var statusCode = response.statusCode;
      winston.log('info', '### STATUS CODE ' + response.statusCode + ' ###');

      if(body && statusCode == '200')
      {
        resultObj = JSON.parse(body);
        winston.log('info', "Policy activated, collected and paid: " + resultObj);
        resolve(resultObj);
      } else {
        resultObj = JSON.parse(body);
        winston.log('info', "Error " + resultObj.message);
        reject (resultObj.message);
      }

    });
  });
}

function generateAuthHeader() {

  var urlBytes = new Buffer(credentials);
  var base64Credendials = urlBytes.toString('base64');

  winston.log('info', "base64Credendials " + base64Credendials);

  var headers = {
    'Authorization': 'Basic ' + base64Credendials,
    'Content-Type': 'application/json'
  };

  return headers;
};



module.exports = {
  createCustomer,
  createPolicy,
  calculatePolicy,
  activateCollectPayPolicy
};
