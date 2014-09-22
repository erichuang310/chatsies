(function () {
  if (typeof ChatApp === 'undefined') {
    window.ChatApp = {};
  }

  var ChatUi = ChatApp.ChatUi = function ($rootEl) {
    this.$rootEl = $rootEl;
    this.socket = io();
    this.chat = new ChatApp.Chat(this.socket);
    $("#chat-form").on("submit", this.submitHandler.bind(this));
  }
  
  ChatUi.prototype.submitHandler = function (event) {
    event.preventDefault();
    var message = this.$rootEl.find("#chat-input").val();
    $(event.target).find("input[type=text]").val("");
    this.chat.sendMessage(message);
    this.addMessage(message);
  };

  ChatUi.prototype.addMessage = function (message) {
    var chatEntry = $("<li>");
    chatEntry.text(message);
    $("#chat-log").append(chatEntry);
  };
  
})();