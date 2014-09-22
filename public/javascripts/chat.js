(function() {
  if (typeof ChatApp === 'undefined'){
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function (socket, chatUi) {
    this.socket = socket;
    this.chatUi = chatUi;
    this.socket.on("nicknameChangeResult", this.handleNicknameChange.bind(this));
    this.socket.on("message", this.handleMessage.bind(this));
  };

  Chat.prototype.sendMessage = function(msg) {
    if (msg.toLowerCase().indexOf('/nick') === 0) {
      this.socket.emit("nicknameChangeRequest", {
        nickname: msg.slice(6)
      });
    } else {
      this.socket.emit("message", { message: msg, nickname: this.nickname });
    } 
  };
  
  Chat.prototype.handleMessage = function (data) {
    this.chatUi.addMessage(data.message);
  };
  
  Chat.prototype.handleNicknameChange = function (data) {
    this.nickname = data.nickname;
  };

})();