var config = {};

var env = process.env.NODE_ENV || 'development';


config.ibsuite_token = '58A8BF724BA77D4714A4DCA41D61CF36';
config.ibsuite_url = 'https://101danand.ibapps.dk/101danand/rest/v1/json/callJSON?';


process.env.PORT = 3000;

module.exports = config;
