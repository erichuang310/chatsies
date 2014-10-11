"use strict";

var http = require('http'),
nodeStatic = require('node-static');
// socketio = require('socket.io');

var file = new nodeStatic.Server('./public');

var server = http.createServer(function (req, res) {
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
});

var chatServer = new require("./chat_server").ChatServer(server);

server.listen(8000);
