module.exports = function(server) {
  var guestNumber = 0;
  var nicknames = {};
  var io = require("socket.io")(server);

  

  io.on("connection", function (socket) {
    
    // socket.on("message", function (data) {
//       if (data.message.toLowerCase().indexOf("/nick") === 0) {
//         socket.emit("nickNameChangeRequest")
//       }
//     });
    guestNumber++;
    nicknames[guestNumber] = "Guest " + guestNumber;
    
    socket.emit('nicknameChangeResult', {
      success: true,
      nickname: nicknames[guestNumber]
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
        nicknames[guestNumber] = nickname;
      }    
    });
  });
};