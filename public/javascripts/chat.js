(function() {
  if (typeof ChatApp === 'undefined'){
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function (socket) {
    this.socket = socket;
    
    this.socket.on("nicknameChangeResult", this.handleNicknameChange.bind(this));
  };

  Chat.prototype.sendMessage = function(msg) {
    if (msg.toLowerCase().indexOf('/nick') === 0) {
      this.socket.emit("nicknameChangeRequest", {
        nickname: msg.slice(6)
      });
    } else {
      this.socket.emit("message", { message: msg });
    } 
  };
  
  Chat.prototype.handleNicknameChange = function (data) {
    console.log("WTF");
    debugger
    this.nickname = data.nickname;
  };

})();