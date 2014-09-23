module.exports = function(server) {
  var guestNumber = 0;
  var nicknames = {};
  var io = require("socket.io")(server);
  
  io.on("connection", function (socket) {
    guestNumber++;
    nicknames[socket.id] = "Guest " + guestNumber;
    
    io.emit('message', {
      message: nicknames[socket.id] + " joined our world."
    });
    
    socket.emit('nicknameChangeResult', {
      success: true,
      nickname: nicknames[socket.id]
    });
    
    socket.on("message", function(data) {
      io.emit("message", { message: data.nickname + ': ' + data.message });
    });
    
    socket.on("usersRequest", function (data) {
      var users = [];
      for (var key in nicknames) {
          users.push(nicknames[key]);
      }

      socket.emit("usersResponse", {
        users: users
      });
    });
    
    socket.on("nicknameChangeRequest", function (data) {
      var valid = true;
      var nickname = data.nickname;
      
      // Check for name starts with guest
      if (nickname.toLowerCase().indexOf("guest") === 0){
        socket.emit('nicknameChangeResult', {
          success: false,
          message: "Name cannot start with guest"
        });
        valid = false;
      }
    
      // Check for existing name
      for (var guestnum in nicknames) {
        if (nicknames[guestnum] === nickname) {
          socket.emit('nicknameChangeResult', {
            success: false,
            message: "Name is already in use"
          });
          valid = false;
          return;
        }
      }
    
      if (valid) {
        socket.emit('nicknameChangeResult', {
          success: true,
          nickname: nickname
        });
        nicknames[socket.io] = nickname;
      }
      
      var users = [];
      for (var key in nicknames) {
          users.push(nicknames[key]);
      }

      io.emit("usersResponse", {
        users: users
      });    
    });
    socket.on("disconnect", function() {
      delete nicknames[socket.id];
      var users = [];
      for (var key in nicknames) {
          users.push(nicknames[key]);
      }

      io.emit("usersResponse", {
        users: users
      });  
    })
  });
};