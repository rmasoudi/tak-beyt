myApp.onPageInit('links', function (page) {
    if(getCurrentUser()==null){
        myApp.alert(MSG_LOGIN_FIRST,"");
        myApp.loadPage("index");
        return;
    }
    $("#friendsContainer").empty();
    $("#sentContainer").empty();
    $("#receivedContainer").empty();
    $.ajax({
        url: baseUrl + "users/getlinks",
        type: "POST",
        data: JSON.stringify({"id": getCurrentUser().id}),
        contentType: "application/json",
        success: function (linkmodel) {
            for (var i = 0; i < linkmodel.sent.length; i++) {
                var personElem = renderPerson(linkmodel.sent[i].user);
                if (linkmodel.sent[i].link.status === LINK_STATUS_WAITING) {
                    $("#sentContainer").append(personElem);
                }
                else if (linkmodel.sent[i].link.status === LINK_STATUS_ACCEPTED) {
                    appendMessageButton(personElem,linkmodel.sent[i].user)
                    $("#friendsContainer").append(personElem);
                }
                else if (linkmodel.sent[i].link.status === LINK_STATUS_REJECTED) {
                    $("#rejectedContainer").append(personElem);
                }
            }
            for (var i = 0; i < linkmodel.received.length; i++) {
                var personElem = renderPerson(linkmodel.received[i].user);
                if (linkmodel.received[i].link.status === LINK_STATUS_WAITING) {
                    $("#receivedContainer").append(personElem);
                    appendAcceptRejectButtons(personElem, linkmodel.received[i].link.id)
                }
                else if (linkmodel.received[i].link.status === LINK_STATUS_ACCEPTED) {
                    appendMessageButton(personElem,linkmodel.received[i].user)
                    $("#friendsContainer").append(personElem);
                }
                else if (linkmodel.received[i].link.status === LINK_STATUS_REJECTED) {
                    $("#rejectedContainer").append(personElem);
                }
            }
            $(".users-container").find(".row").css("width", "100%");
        }
    });
});

function appendAcceptRejectButtons(personElem, linkId) {
    var acceptButton = $("<a href='#' class='item-link list-button link-button'></a>");
    var acceptIcon = $("<i class='fa fa-check'></i>");
    var acceptTitle = $("<span> پذیرفتن</span>");
    acceptButton.data("id", linkId);
    acceptButton.on("click", function () {
        var linkId = $(this).data().id;
        $.ajax({
            url: baseUrl + "users/editlink",
            type: "POST",
            data: JSON.stringify({"id": linkId, "status": LINK_STATUS_ACCEPTED}),
            contentType: "application/json",
            success: function () {
                myApp.alert(MSG_REQUEST_SENT);
            }
        });
    });

    var rejectButton = $("<a href='#' class='item-link list-button link-button'></a>");
    var rejectIcon = $("<i class='fa fa-close'></i>");
    var rejectTitle = $("<span> رد کردن</span>");
    rejectButton.data("id", linkId);
    rejectButton.on("click", function () {
        var linkId = $(this).data().id;
        $.ajax({
            url: baseUrl + "users/editlink",
            type: "POST",
            data: JSON.stringify({"id": linkId, "status": LINK_STATUS_REJECTED}),
            contentType: "application/json",
            success: function () {
                myApp.alert(MSG_REQUEST_SENT);
            }
        });
    });

    acceptButton.append(acceptIcon);
    acceptButton.append(acceptTitle);
    rejectButton.append(rejectIcon);
    rejectButton.append(rejectTitle);

    var col2 = $("<div><div/>").addClass("col-33");
    col2.append(acceptButton).append(rejectButton);
    $(personElem).find(".col-33").first().after(col2);
}


function appendMessageButton(personElem, partner) {
    var messageButton = $("<a href='messaging.html' class='item-link list-button link-button'></a>");
    var messageIcon = $("<i class='fa fa-envelope-o'></i>");
    var messageTitle = $("<span> ارسال پیام</span>");
    GLOBALS.currentPartner = partner;

    messageButton.append(messageIcon);
    messageButton.append(messageTitle);

    var col2 = $("<div><div/>").addClass("col-33");
    col2.append(messageButton);
    $(personElem).find(".col-33").first().after(col2);
}