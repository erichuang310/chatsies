
var http = require('http'),
  static = require('node-static'),
  socketio = require('socket.io');

var file = new static.Server('./public');

var server = http.createServer(function (req, res) {
  // req.addListener('chat', function (data) {
  //   console.log(data);
  // });
  
  req.addListener('end', function () {
    file.serve(req, res);
  }).resume();
  
});
var chatServer = require("./chat_server")(server);


server.listen(8000);
