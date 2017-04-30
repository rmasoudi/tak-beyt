var baseUrl = "http://localhost:9998/";

var myApp = new Framework7({
    tapHold:true
});
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

setInterval(syncUser,600000);
setInterval(updateGeoLocation,10000);

$.ajaxPrefilter(function (options) {
    if (!options.beforeSend) {
        options.beforeSend = function (xhr) {
            xhr.setRequestHeader('Authorization', getAuthToken());
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        }
    }
});
function loadUserInfo() {
    if (getCurrentUser() != null) {
        var user = getCurrentUser();
        $$("#lblName").html(user.name);
        $$("#lblScore").html("امتیاز: " + user.score);
        $$("#lblRank").html("رتبه: " + user.rank);
        $$("#lblCoin").html(user.coin);
        mainView.loadPage("menu.html");
        loadUserImage();

    }
    else {
        $$("#lblName").html(TXT_GUEST);
        $("#imgUser").attr("src", "images/user.png");
        $$("#lblScore").html("");
        $$("#lblRank").html("");
        $$("#lblCoin").html("");
    }
}
function renderPerson(person, index, withLinkButton) {
    var li = $("<li></li>").addClass("item-content").addClass("user-item");
    var row = $("<div></div>").addClass("row").addClass("list-button");
    var col1 = $("<div><div/>").addClass("col-33");
    var col2 = $("<div><div/>").addClass("col-33");
    var col3 = $("<div><div/>").addClass("col-33");
    var image = $("<img />").attr("src", baseUrl + "users/download/" + person.id).addClass("user-image");
    image.attr("onerror", "this.src='images/user.png'");

    col1.append($("<div>" + person.name + "</div>"));
    if (person.cityId !== undefined && person.cityId !== null && person.cityId !== 0) {
        col1.append($("<div class='user-details'>" + getCityName(person.cityId) + "</div>"));
    }
    col1.append($("<div class='user-details'>" + "امتیاز: " + (person.score) + "</div>"));
    if (index !== undefined && index !== null) {
        col1.append($("<div class='user-details'>" + "رتبه: " + (index + 1) + "</div>"));
    }
    row.append(col1);
    if (withLinkButton !== undefined && withLinkButton !== null) {
        var linkButton = $("<a href='#' class='item-link list-button link-button'></a>");
        var linkIcon = $("<i class='fa fa-handshake-o'></i>");
        var linkTitle = $("<span>درخواست دوستی</span>");
        linkButton.data("id", person.id);
        linkButton.on("click", function () {
            var toId = $(this).data().id;
            var fromId = getCurrentUser().id;
            $.ajax({
                url: baseUrl + "users/savelink",
                type: "POST",
                data: JSON.stringify({"fromId": fromId, "toId": toId}),
                contentType: "application/json",
                success: function () {
                    myApp.alert(MSG_REQUEST_SENT);
                }
            });
        });
        linkButton.append(linkIcon);
        linkButton.append(linkTitle);
        col2.append(linkButton);
        row.append(col2);
    }
    col3.append(image);
    row.append(col3);
    li.append(row);
    return li;
}
function loadUserImage() {
    $("#imgUser").attr("src", baseUrl + "users/download/" + getCurrentUser().id);
}
function getCityName(cityId) {
    return cities[cityId];
}
function loadCities() {
    var autoCompleteDropdownSimple = myApp.autocomplete({
        input: '#state-dropdown',
        openIn: 'dropdown',
        expandInput: true,
        textProperty: 'name',
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            for (var i = 0; i < states.length; i++) {
                if (states[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                    results.push(states[i]);
                }
            }
            render(results);
        },
        onChange: function (a, selected) {
            var cities = selected.cities;
            var cityDropDown = myApp.autocomplete({
                input: '#city-dropdown',
                openIn: 'dropdown',
                expandInput: true,
                textProperty: 'name',
                source: function (autocomplete, query, render) {
                    var results = [];
                    if (query.length === 0) {
                        render(results);
                        return;
                    }
                    for (var i = 0; i < cities.length; i++) {
                        if (cities[i].name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                            results.push(cities[i]);
                        }
                    }
                    render(results);
                },
                onChange: function (a, selected) {
                    selectedCityId = selected.id;
                }
            });
        }
    });
}

function loadFriends() {
    if (getCurrentUser() != null) {
        $.ajax({
            url: baseUrl + "users/getlinks",
            type: "POST",
            data: JSON.stringify({"id": getCurrentUser().id}),
            contentType: "application/json",
            success: function (friends) {
                GLOBALS.friendIds = [];
                for (var i = 0; i < friends.sent.length; i++) {
                    if (friends.sent[i].link.status !== LINK_STATUS_REJECTED) {
                        GLOBALS.friendIds.push(friends.sent[i].user.id);
                    }
                }
                for (var i = 0; i < friends.received.length; i++) {
                    if (friends.received[i].link.status !== LINK_STATUS_REJECTED) {
                        GLOBALS.friendIds.push(friends.received[i].user.id);
                    }
                }
            }
        });
    }
}