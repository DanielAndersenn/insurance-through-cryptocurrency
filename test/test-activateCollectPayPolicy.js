const ibsuite = require('.././interfaces/ibsuite');

var result = ibsuite.activateCollectPayPolicy('1031010100000049');

result.then((result) => {
  console.log('info', 'Received success response from IBSuite');
  console.log(result);
}, (error) => {
  console.log('info', 'Received error response from IBSuite');
  console.log(error);
});
