"use strict";

(function () {
  if (typeof ChatApp === 'undefined') {
    window.ChatApp = {};
  }

  var ChatUi = ChatApp.ChatUi = function ($rootEl) {
    this.$rooms = $("#rooms");
    this.$messageLogPanel = $(".panel-body");
    this.$chatLog = $(".chat-log");
    this.$messageInput = $("#message-input");
    this.$messageForm = $("#message-form");
    this.chat = new ChatApp.Chat(this);

    this.$messageForm.on("submit", this.submitHandler.bind(this));
    this.chat.socket.on('roomList', this.updateRoomList.bind(this));
    this.chat.socket.on("message", this.addMessageView.bind(this));
  };

  ChatUi.prototype.submitHandler = function (event) {
    console.log("WHOAH")
    event.preventDefault();
    var message = this.$messageInput.val();
    this.$messageInput.val("");
    this.chat.sendMessage(message);
  };

  ChatUi.prototype.updateRoomList = function (roomData) {
    this.$rooms.empty();
    for(var room in roomData) {
      this.$rooms.append(room + "<br>");
      roomData[room].forEach(function (username) {
        this.$rooms.append(" - " + username + "<br>");
      }.bind(this));
      this.$rooms.append("<br>");
    }
  };

  ChatUi.prototype.addMessageView = function (message) {
    var template = $(".chat-template").html()

    var chatEntry = _.template(template);
    var chatEntry = chatEntry({
      username: message.username,
      text: message.text,
      timeago: jQuery.timeago(new Date())
    })

    this.$chatLog.append(chatEntry);
    this.$messageLogPanel.scrollTop(this.$chatLog.height());
    // setjQuery.timeago(new Date())
  };
})();
