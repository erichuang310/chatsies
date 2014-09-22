module.exports = function(server) {
  var io = require("socket.io")(server);

  io.on("connection", function (socket) {

    socket.emit("message", { hello: "world" });
    
    // socket.on("end", function (data) {
    //   console.log(data);
    // });
    //
    // socket.on('event', function (data) {
    //   console.log(data);
    // });
  });
};