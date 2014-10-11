"use strict";

(function() {
  if (typeof ChatApp === 'undefined'){
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function (chatUi) {
    this.socket = io();
    this.chatUi = chatUi;
  };

  Chat.prototype.sendMessage = function(text) {
    if (text.indexOf("/") === 0) {
      this.sendCommand(text);
    } else {
      this.socket.emit("message", {
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
    } else if (command.indexOf('/join') === 0) {
      var room = command.slice(6);
      this.socket.emit("roomChangeRequest", { room: room})
    } else {
      this.chatUi.addMessageView({
        text: "Invalid command: " + command.slice(1)
      });
    }
  };
})();
