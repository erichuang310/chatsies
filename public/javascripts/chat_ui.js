"use strict";

(function () {
  if (typeof ChatApp === 'undefined') {
    window.ChatApp = {};
  }

  var ChatUi = ChatApp.ChatUi = function (id) {


    this.$users = $("#users");
    this.$chatLogContainer = $("#chat-log-container");
    this.$chatLog = $("#chat-log");
    this.$chatInput = $("#chat-input");
    this.$usernameRequestForm = $("form#username-request");
    this.$roomRequestForm = $("form#room-request");
    this.$roomName = $("#room-name");

    this.chat = new ChatApp.Chat();
    if (window.location.pathname.split("/")[1]) {
  	  this.room = window.location.pathname.split("/")[1];
      this.chat.sendMessage("/room " + this.room);
      this.$roomName.html(this.room.toUpperCase());
    } else {
      this.room = "lobby";
    }

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
        this.sendMessage("submit");
      } else {
        this.sendMessage("update");
      }
    }.bind(this));
  };

  ChatUi.prototype.requestUsername = function (event) {
    event.preventDefault();
    var username = $(event.currentTarget).find("input[name=username]").val();
    $(event.currentTarget).find("input[name=username]").val("");
    this.chat.sendMessage("/username " + username);
    $("#username-modal").modal("hide");
  };

  ChatUi.prototype.requestRoom = function (event) {
    event.preventDefault();
    var room = $(event.currentTarget).find("input[name=room]").val();
    this.room = room;
    this.$roomName.html(this.room.toUpperCase());
    $(event.currentTarget).find("input[name=room]").val("");
    this.chat.sendMessage("/room " + room);
    $("#room-modal").modal("hide");
  };

  ChatUi.prototype.sendMessage = function (status) {
    var message = this.$chatInput.val();
    if (message.length > 0) {
      if (status === "submit")
        this.$chatInput.val("");
      this.chat.sendMessage(message, status);
    }
  };

  ChatUi.prototype.updateRoomList = function (roomData) {
    var that = this;
    this.$users.empty();
    _(roomData[this.room]).each( function (username) {
      that.$users.append(username + "<br>");
    });
  };

  ChatUi.prototype.addMessageView = function (msg) {
    var messageTemplate =
      _.template(
        '<div class="message active" data-username="<%= escaped_username %>">' +
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
      escaped_username: escape(msg.username),
      username: msg.username,
      text: msg.text,
      date: new Date().toISOString(),
      timeago: jQuery.timeago(new Date())
    });
    $(message).addClass("active");
    //
    var $usersLastMessage =
      $("div.active.message[data-username=\"" + escape(msg.username) + "\"]");

    if (msg.status === "update") {
      if ($usersLastMessage.length === 0) {
        this.$chatLog.append(message);
      } else {
        $($usersLastMessage.last()).find("p").html(msg.text);
      }

    } else {
      $usersLastMessage.last().removeClass("active");
      $usersLastMessage.last().find("p").html(msg.text);
    }
    this.$chatLogContainer.scrollTop(this.$chatLog.height());

  };
})();
