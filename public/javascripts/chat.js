"use strict";

(function() {
  if (typeof ChatApp === 'undefined'){
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function () {
    this.socket = io();
  };

  Chat.prototype.sendMessage = function(text, status) {
    this.socket.emit("message", {
      status: status,
      text: text
    });
  };

  Chat.prototype.requestRoom = function (room) {
    this.socket.emit("roomChangeRequest", { room: room });
  };

  Chat.prototype.requestUsername = function (username) {
    this.socket.emit("usernameChangeRequest", { username: username });
  };
})();
