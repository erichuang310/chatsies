"use strict";

(function() {
  if (typeof ChatApp === 'undefined'){
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function () {
    this.socket = io();
  };

  Chat.prototype.sendMessage = function(options) {
    this.socket.emit("message", {
      status: options.status,
      text: options.text
    });
  };

  Chat.prototype.requestRoom = function (room) {
    this.socket.emit("roomChangeRequest", { room: room });
  };

  Chat.prototype.requestUsername = function (username) {
    this.socket.emit("usernameChangeRequest", { username: username });
  };
})();
