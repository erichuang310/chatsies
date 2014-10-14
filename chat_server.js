"use strict";

var usernames = {};
var takenUsernames = [];
var rooms = {};

var currentUsername = (function () {
  var guestNumber = 0;

  return function () {
    guestNumber += 1;
    return "Guest " + guestNumber;
  };
})();

var joinRoom = function (socket, io, room) {
  socket.join(room);
  rooms[socket.id] = room;

  // io.to(room).emit('message', {
  //   username: usernames[socket.id] + " entered the room",
  //   // text: "joined " + room,
  //   room: room
  // });
};

var handleMessage = function (socket, io) {
  socket.on('message', function (data) {
    io.to(rooms[socket.id]).emit('message', {
      username: usernames[socket.id],
      status: data.status,
      text: data.text
    });
  });
};

var handleDisconnect = function (socket, io) {
  socket.on('disconnect', function () {
    var usernameIndex = takenUsernames.indexOf(usernames[socket.id]);
    delete takenUsernames[usernameIndex];

    var currentRoom = rooms[socket.id];
    // io.to(currentRoom).emit('message', {
    //   username: usernames[socket.id] + " left the room",
    //   // text: (" is leaving " + currentRoom + "."),
    //   room: currentRoom
    // });

    delete usernames[socket.id];
    delete rooms[socket.id];
    io.sockets.emit('roomList', getRoomData(io));
  });
};

var usernameStartsWithGuest = function(username) {
  return username.toLowerCase().indexOf("guest") === 0;
};

var usernameTaken = function (name) {
  return takenUsernames.indexOf(name) !== -1
};

var handleUsernameChangeRequest = function (socket, io) {
  socket.on('usernameChangeRequest', function (data) {
    var username = data.username;

    if (usernameStartsWithGuest(username)) {
      socket.emit('usernameChangeResult', {
        success: false,
        message: "Username cannot start with guest"
      });
    } else if (usernameTaken(username)) {
      socket.emit('usernameChangeResult', {
        success: false,
        message: "Username is taken"
      });
    } else {
      var prevName = usernames[socket.id];
      var prevNameIndex = takenUsernames.indexOf(prevName);

      takenUsernames[prevNameIndex] = username;
      usernames[socket.id] = username;

      socket.emit('usernameChangeResult', {
        success: true,
        username: username
      });
      io.sockets.emit('roomList', getRoomData(io));
    }
  });
};

var handleRoomChangeRequests = function (socket, io) {
  socket.on('roomChangeRequest', function (data) {
    var room = data.room;
    var prevRoom = rooms[socket.id];
    socket.leave(prevRoom);
    joinRoom(socket, io, room);
    io.sockets.emit('roomList', getRoomData(io));
  });
};

var getRoomData = function (io) {
  var roomData = {};
  for (var socketId in rooms) {
    var room = rooms[socketId];
    if (!roomData.hasOwnProperty(room)) roomData[room] = [];
    roomData[room].push(usernames[socketId]);
  }

  return roomData;
};

var ChatServer = function(io) {
  io.on("connection", function (socket) {
    usernames[socket.id] = currentUsername();
    joinRoom(socket, io, "lobby");
    handleMessage(socket, io);
    handleUsernameChangeRequest(socket, io);
    handleRoomChangeRequests(socket, io);
    handleDisconnect(socket, io);
    io.sockets.emit('roomList', getRoomData(io));
  });
};

module.exports.ChatServer = ChatServer;
