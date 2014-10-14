"use strict";

(function() {
  if (typeof ChatApp === 'undefined'){
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function () {
    this.socket = io();
  };

  Chat.prototype.sendMessage = function(text, status) {
    if (text.indexOf("/") === 0) {
      this.sendCommand(text);
    } else {
      this.socket.emit("message", {
        status: status,
        text: text
      });
    }
  };

  Chat.prototype.sendCommand = function(command) {
    if (command.toLowerCase().indexOf('/username') === 0) {
      var username = command.slice(10);
      this.socket.emit("usernameChangeRequest", {
        username: username
      });
    } else if (command.indexOf('/') === 0) {
      var room = command.slice(6);
      this.socket.emit("roomChangeRequest", { room: room})
    }
  };
})();
