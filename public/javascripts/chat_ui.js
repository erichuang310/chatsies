"use strict";

(function () {
  if (typeof ChatApp === 'undefined') {
    window.ChatApp = {};
  }

  var ChatUi = ChatApp.ChatUi = function ($rootEl) {
    this.$rooms = $("#rooms");
    this.$chatLogContainer = $("#chat-log-container");
    this.$chatLog = $("#chat-log");
    // this.$chatLog = $(".chat-log");
    this.$chatInput = $("#chat-input");
    this.chat = new ChatApp.Chat();

    this.$chatInput.keydown(function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.sendMessage();
      }
    }.bind(this));

    this.chat.socket.on('roomList', this.updateRoomList.bind(this));
    this.chat.socket.on("message", this.addMessageView.bind(this));
  };

  ChatUi.prototype.sendMessage = function () {
    var message = this.$chatInput.val();
    if (message.length > 0) {
      this.$chatInput.val("");
      this.chat.sendMessage(message);
    }
  };

  ChatUi.prototype.updateRoomList = function (roomData) {
    this.$rooms.empty();
    for(var room in roomData) {
      roomData[room].forEach(function (username) {
        this.$rooms.append(username + "<br>");
      }.bind(this));
    }
  };

  ChatUi.prototype.addMessageView = function (message) {
    var messageTemplate =
      _.template(
        '<div class="message">' +
          '<div class="header">' +
            '<strong class="primary-font"><%= username %></strong>' +
            '<small class="pull-right text-muted">' +
              '<span class="glyphicon glyphicon-time"></span> ' +
                '<abbr class="timeago" title="<%= date %>"><%= timeago %></abbr>' +
            '</small>' +
          '</div>' +
          '<p>' +
            '<%= text %>' +
          '</p>' +
        '</div>'
      );

    var message = messageTemplate({
      username: message.username,
      text: message.text,
      date: new Date().toISOString(),
      timeago: jQuery.timeago(new Date())
    });

    this.$chatLog.append(message);
    this.$chatLogContainer.scrollTop(this.$chatLog.height());
  };
})();
