var baseUrl = "http://localhost:9998/";
var myApp = new Framework7({
    tapHold: false
});
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

var mySwiper = myApp.swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    initialSlide: 4
});

var counter = 1;
for (var i = 1; i <= 5; i++) {
    var page = $("#page" + i);
    var table = $("<table class='levelTable'></table>");
    for (var j = 0; j < 6; j++) {
        var row = $("<tr></tr>");
        for (var k = 0; k < 5; k++) {
            var div = $("<div>" + counter + "</div>");
            if (counter > getLevel()) {
                div.addClass("disabled");
            }
            else {
                div.addClass("levelItem");
            }
            div.click(function () {
                if ($(this).hasClass("levelItem")) {
                    localStorage.setItem(StorageFields.PLAYING_LEVEL, (parseInt($(this).html().trim())));
                    mainView.loadPage("play.html");
                }
            });
            var col = $("<td></td>");
            col.append(div);
            counter++;
            row.append(col);
        }
        table.append(row);
    }
    page.append(table);

}

function getLevel() {
    var level = localStorage.getItem(StorageFields.LEVEL);
    if (level === null || level === undefined) {
        level = 1;
        localStorage.setItem(StorageFields.LEVEL, 1);
        return level;
    }
    return parseInt(level);
}