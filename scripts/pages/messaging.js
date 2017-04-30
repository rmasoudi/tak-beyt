var currentUser = null;
var lastSeenId = 0;
var messagesObj = null;
myApp.onPageInit('messaging', function (page) {
    if(getCurrentUser()==null){
        myApp.alert(MSG_LOGIN_FIRST,"");
        myApp.loadPage("index");
        return;
    }
    messagesObj = myApp.messages(".messages", {autoLayout: true});
    lastSeenId = 0;
    currentUser = getCurrentUser();
    loadMessages();
    $("#txtMessageContent").focus();
    $("#btnSendMessage").on("click", function () {
        var content = $("#txtMessageContent").val();
        if (content.trim() == "") {
            return;
        }
        var message = {"fromId": currentUser.id, "toId": GLOBALS.currentPartner.id, "id": 0, "content": content, "insertTime": new Date()};
        var elem = appendMessage(message, currentUser, "sent", true);
        $.ajax({
            url: baseUrl + "users/savemessage",
            type: "POST",
            data: JSON.stringify(message),
            contentType: "application/json",
            success: function (message) {
                if (!isNaN(message.insertTime)) {
                    message.insertTime = new Date(message.insertTime);
                }
                appendTime(message.insertTime, elem);
                insertMessage(GLOBALS.currentPartner.id, message);
                if (message.id > lastSeenId) {
                    lastSeenId = message.id;
                }
            }
        });

        $("#txtMessageContent").val("");
        $("#txtMessageContent").focus();
    });
});

function loadMessages() {
    var localMessages = getPartnerMessages(GLOBALS.currentPartner.id);
    for (var i = 0; i < localMessages.length; i++) {
        var elem;
        if (localMessages[i].fromId === currentUser.id) {
            elem = appendMessage(localMessages[i], currentUser, "sent", false);
        }
        else {
            elem = appendMessage(localMessages[i], GLOBALS.currentPartner, "received", false);
        }
        appendTime(localMessages[i].insertTime, elem);
        if (localMessages[i].id > lastSeenId) {
            lastSeenId = localMessages[i].id;
        }
    }
    syncMessages();
    setInterval(syncMessages,3000);
}

function syncMessages() {
    $.ajax({
        url: baseUrl + "users/newmessages",
        type: "POST",
        data: JSON.stringify({"fromId": GLOBALS.currentPartner.id, "toId": currentUser.id, "lastSeenId": lastSeenId}),
        contentType: "application/json",
        success: function (messages) {
            for (var i = 0; i < messages.length; i++) {
                var elem;
                if (messages[i].fromId === currentUser.id) {
                    elem = appendMessage(messages[i], currentUser, "sent", false);
                }
                else {
                    elem = appendMessage(messages[i], GLOBALS.currentPartner, "received", false);
                }
                appendTime(messages[i].insertTime, elem);
                insertMessage(GLOBALS.currentPartner.id, messages[i]);
                if (messages[i].id > lastSeenId) {
                    lastSeenId = messages[i].id;
                }
            }
        }
    });
}

function appendMessage(message, user, type, animate) {
    return messagesObj.appendMessage({
        text: message.content,
        type: type,
        name: user.name,
        avatar: baseUrl + "users/download/" + user.id
    }, animate);
}

function appendTime(time, elem) {
    time = new Date(Date.parse(time));
    time = time.getHours() + ":" + time.getMinutes();
    var timeElem = $("<span>" + time + "</span>").addClass("message-time_field");
    $(elem).find(".message-text").append(timeElem);
}