var cfenv = require('cfenv')
  , appEnv = cfenv.getAppEnv();

var environment = {};

environment.port = appEnv.port;
environment.address = appEnv.bind;

var mongoConfig = appEnv.getServiceCreds('MongoInstance');
// environment.mongo = {
//   uri: mongoConfig.uri,
//   scheme: mongoConfig.scheme,
//   host: mongoConfig.host,
//   port: mongoConfig.port,
//   db: mongoConfig.db,
//   poolSize: mongoConfig.poolSize
// };

environment.userBaseDirectory = 'mage/users';
environment.iconBaseDirectory = 'mage/icons';
environment.attachmentBaseDirectory = 'mage/attachments';

module.exports = environment;