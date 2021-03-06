require('newrelic');
var express = require('express'),
app = express();
var port = process.env.PORT || 5000;

var io = require('socket.io').listen(app.listen(port));
var chatServer = require('./chat_server').ChatServer(io);

require('./config')(app, io);
require('./routes')(app, io);

console.log('Your application is running on http://localhost:' + port);
