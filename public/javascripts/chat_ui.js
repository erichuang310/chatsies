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
    this.$roomCopyUrl = $("#room-copy-url");
    this.chat = new ChatApp.Chat();
    this.initChat();

    // if (window.location.pathname.split("/")[1]) {
  	  // this.room = window.location.pathname.split("/")[1];
    // } else {
      // this.room = "lobby";
    // }/
    // this.chat.sendMessage("/room " + this.room);

    // this.$roomName.html(this.room.toUpperCase());
    // this.$roomCopyUrl.attr("href", "http://www.chatsies.com/" + this.room);
    // this.cycleTitles();
    this.handleChatInputChanges();
    this.handleRoomChanges();
    this.handleMessages();
    // this.handleUsernameChanges();
    this.$roomRequestForm.on("submit", this.requestRoom.bind(this));
    this.$usernameRequestForm.on("submit", this.requestUsername.bind(this));

  };

  ChatUi.prototype.initChat = function () {
    this.chat.socket.on("connected", function (data) {
      this.username = data.username;
      this.room = data.room;
    }.bind(this));
  };

  ChatUi.prototype.handleChatInputChanges = function () {
    // var message = this.$chatInput.val();
    this.$chatInput.on("keyup keydown", function (event) {
      var text = $(event.currentTarget).val().trim();
      if (event.keyCode === 13) {
        event.preventDefault();
        this.$chatInput.val("");
        var status = "submit";
      } else {
        var status = "update";
      }

      this.chat.sendMessage({
        status: status,
        text: text
      });
    }.bind(this));
  };

  ChatUi.prototype.requestUsername = function (event) {
    event.preventDefault();
    var username = $(event.currentTarget).find("input[name=username]").val();
    $(event.currentTarget).find("input[name=username]").val("");
    this.chat.requestUsername(username);
    $("#username-modal").modal("hide");
  };

  ChatUi.prototype.requestRoom = function (event) {
    event.preventDefault();
    this.room = $(event.currentTarget).find("input[name=room]").val();
    $(event.currentTarget).find("input[name=room]").val("");
    this.chat.requestRoom(this.room);
    this.$roomName.html(this.room.toUpperCase());
    this.$roomCopyUrl.attr("href", "http://www.chatsies.com/" + this.room);
    window.history.pushState("", "", this.room);
    $("#room-modal").modal("hide");
  };

  ChatUi.prototype.handleRoomChanges = function () {
    var that = this;
    this.chat.socket.on('roomList', function (roomData) {
      that.$users.empty();
      _(roomData[that.room]).each( function (username) {
        that.$users.append(username + "<br>");
      });
    });
  };

  ChatUi.prototype.messageTemplate = function () {
    var messageTemplate = _.template(
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

    return messageTemplate;
  }

  ChatUi.prototype.handleMessages = function () {
    this.chat.socket.on("message", function (msg) {
      var $usersLastMessage =
        $("div.active.message[data-username=\"" + escape(msg.username) + "\"]");

      if (msg.status === "update") {
        if ((msg.text).length === 0) {
          $usersLastMessage.remove();
        } else if ($usersLastMessage.length === 0) {
          this.appendMessage(msg)
        } else {
          $($usersLastMessage.last()).find("p").html(msg.text);
        }
      } else {
        $usersLastMessage.last().removeClass("active");
        $usersLastMessage.last().find("p").html(msg.text);
      }
      this.$chatLogContainer.scrollTop(this.$chatLog.height());
    }.bind(this));
  };

  ChatUi.prototype.cycleTitles = function () {
    var that = this;
    setTimeout( function () {
      debugger;
      var numUsersTyping = $("div.active:not(.message[data-username=\"" + escape(that.username) + "\"])").length;
      if (numUsersTyping) {
        document.title = "(" + numUsersTyping + ") Chatsies";
      } else {
        document.title = "Chatsies";
      }
      that.cycleTitles();
    }, 1000);

  };

  ChatUi.prototype.appendMessage = function (msg) {
    var message = this.messageTemplate()({
      escaped_username: escape(msg.username),
      username: msg.username,
      text: msg.text,
      date: new Date().toISOString(),
      timeago: jQuery.timeago(new Date())
    });
    $(message).addClass("active");
    this.$chatLog.append(message);
  };

  ChatUi.prototype.updateMessage
})();
