"use strict";

var http = require('http');
var nodeStatic = require('node-static');
var socketio = require('socket.io');

var file = new nodeStatic.Server('./public');

var port = process.env.PORT || 8080;

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

var chatServer = new require("./chat_server").ChatServer(server);

server.listen(port);
