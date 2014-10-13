"use strict";

(function () {
  if (typeof ChatApp === 'undefined') {
    window.ChatApp = {};
  }

  var ChatUi = ChatApp.ChatUi = function (id) {

    this.chat = new ChatApp.Chat();
    if (window.location.pathname.split("/")[1]) {
  	  this.room = window.location.pathname.split("/")[1];
      this.chat.sendMessage("/room " + this.room);
    } else {
      this.room = "lobby";
    }

    this.$rooms = $("#rooms");
    this.$chatLogContainer = $("#chat-log-container");
    this.$chatLog = $("#chat-log");
    this.$chatInput = $("#chat-input");
    this.$usernameRequestForm = $("form#username-request");
    this.$roomRequestForm = $("form#room-request");

    this.handleChatInput();
    this.$roomRequestForm.on("submit", this.requestRoom.bind(this));
    this.$usernameRequestForm.on("submit", this.requestUsername.bind(this));
    this.chat.socket.on('roomList', this.updateRoomList.bind(this));
    this.chat.socket.on("message", this.addMessageView.bind(this));
  };

  ChatUi.prototype.handleChatInput = function () {
    this.$chatInput.keydown(function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.sendMessage();
      }
    }.bind(this));
  };

  ChatUi.prototype.requestUsername = function (event) {
    event.preventDefault();
  };

  ChatUi.prototype.requestRoom = function (event) {
    event.preventDefault();
    var room = $(event.currentTarget).find("input[name=room]").val();
    this.room = room;
    $(event.currentTarget).find("input[name=room]").val("");
    this.chat.sendMessage("/room " + room);
    $("#room-modal").modal("hide");
  };

  ChatUi.prototype.sendMessage = function () {
    var message = this.$chatInput.val();
    if (message.length > 0) {
      this.$chatInput.val("");
      this.chat.sendMessage(message);
    }
  };

  ChatUi.prototype.updateRoomList = function (roomData) {
    var that = this;
    this.$rooms.empty();
    _(roomData[this.room]).each( function (username) {
      that.$rooms.append(username + "<br>");
    });
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
