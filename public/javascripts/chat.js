(function() {
  if (typeof ChatApp === 'undefined'){
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
  };

  Chat.prototype.sendMessage = function(msg) {
    console.log("sending");
    this.socket.emit("message", { message: msg });
  };

})();