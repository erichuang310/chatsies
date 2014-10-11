"use strict";

var express = require('express')
var app = express();
var port = process.env.PORT || 5000;

  console.log("WTF");
var io = require('socket.io').listen(app.listen(port));
var chatServer = require('./chat_server').ChatServer(io);

require('./config')(app, io);
require('./routes')(app, io);

console.log('Your application is running on http://localhost:' + port);
