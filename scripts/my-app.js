var baseUrl = "http://localhost:9998/";
var myApp = new Framework7({
    tapHold: false
});
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$(document).ready(function() {
    var counter = 1;
    for (var i = 1; i <= 5; i++) {
        var page = $("#page" + i);
        for (var j = 0; j < 6; j++) {
            var row = $("<div class='row'></div>");
            for (var k = 0; k < 5; k++) {
                var div = $("<div class='col-20 levelItem'>" + counter + "</div>");
                if (counter > getLevel()) {
                    div.addClass("itemDisabled");
                }
                else {
                    div.addClass("itemEnabled");
                }
                div.click(function() {
                    if ($(this).hasClass("itemEnabled")) {
                        var val = parseInt($(this).html().trim());
                        localStorage.setItem(StorageFields.PLAYING_LEVEL, (val));
                        mainView.loadPage("play.html");
                    }
                });
                counter++;
                row.append(div);
            }
            page.append(row);
        }
    }
});

function getLevel() {
    var level = localStorage.getItem(StorageFields.LEVEL);
    if (level === null || level === undefined) {
        level = 1;
        localStorage.setItem(StorageFields.LEVEL, 1);
        return level;
    }
    return parseInt(level);
}