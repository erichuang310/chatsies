(function() {
  if (typeof ChatApp === 'undefined'){
    window.ChatApp = {};
  }

  var Chat = ChatApp.Chat = function (socket, chatUi) {
    this.socket = socket;
    this.chatUi = chatUi;
    this.getUsersList();
    this.socket.on("nicknameChangeResult", this.handleNicknameChange.bind(this));
    this.socket.on("message", this.handleMessage.bind(this));
    this.socket.on("usersResponse", this.handleUsersRequest.bind(this));
  };

  Chat.prototype.sendMessage = function(msg) {
    if (msg.indexOf("/") === 0) {
      this.processCommand(msg);
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
  
  Chat.prototype.handleUsersRequest = function (data) {
    this.chatUi.updateUsersList(data.users);
  };
  
  Chat.prototype.processCommand = function(command) {
    if (command.toLowerCase().indexOf('/nick') === 0) {
      this.socket.emit("nicknameChangeRequest", {
        nickname: command.slice(6)
      });
    } else if (command.indexOf('/getUsers') === 0) {
      this.socket.emit("usersRequest", {});
    } else {
      this.chatUi.addMessage("Invalid command: " + command);
    }
  };
  
  Chat.prototype.getUsersList = function () {
    this.processCommand("/getUsers");
  };
})();