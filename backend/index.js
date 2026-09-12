const { app, startServer } = require('./src/index');

module.exports = app;
module.exports.app = app;
module.exports.startServer = startServer;
