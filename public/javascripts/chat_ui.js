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
    this.room = "lobby";
    // if (window.location.pathname.split("/")[1]) {
  	  // this.room = window.location.pathname.split("/")[1];
    // } else {
      // this.room = "lobby";
    // }/
    // this.chat.sendMessage("/room " + this.room);

    // this.$roomName.html(this.room.toUpperCase());
    // this.$roomCopyUrl.attr("href", "http://www.chatsies.com/" + this.room);

    this.handleChatInput();
    this.$roomRequestForm.on("submit", this.requestRoom.bind(this));
    this.$usernameRequestForm.on("submit", this.requestUsername.bind(this));
    this.chat.socket.on('roomList', this.updateRoomList.bind(this));
    this.chat.socket.on("message", this.addMessageView.bind(this));
  };

  ChatUi.prototype.handleChatInput = function () {


    var message = this.$chatInput.val();
    if (status === "submit") {
      this.$chatInput.val("");
    }

    this.$chatInput.keyup(function (event) {
      var text = $(event.currentTarget).val();

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
      debugger;

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
      if ((msg.text).length === 0) {
        $usersLastMessage.remove();
      } else if ($usersLastMessage.length === 0) {
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
