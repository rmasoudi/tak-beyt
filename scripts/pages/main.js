myApp.onPageInit('play', function (page) {
    init();
});
function init() {
    loadLevel();
    //$(".shaerImage").click(function () {
    //    $(".shaerImage").removeClass("shaerImage-selected");
    //    $(this).addClass("shaerImage-selected");
    //    loadLevel();
    //});
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
function goToNextLevel() {
    var shaer = $(".shaerImage-selected").data().shaer;
    var newLevel = getPlayingLevel() + 1;
    if (newLevel > getLevel()) {
        localStorage.setItem(StorageFields.LEVEL, newLevel);
    }
    setPlayingLevel(newLevel);
    if (shaer === "hafez") {
        shaer = "sadi";
    }
    else if (shaer === "sadi") {
        shaer = "molavi";
    }
    else {
        shaer = "hafez";
    }
    $(".shaerImage").removeClass("shaerImage-selected");
    $("*[data-shaer='" + shaer + "']").addClass("shaerImage-selected");
}

function loadLevel() {
    var level = getPlayingLevel();
    $("#lblLevel").html(level);
    $("#firstSentence").html("");
    $("#secondSentence").html("");
    $("#playContainer").html("");

    if (level >= GLOBALS.LEVEL_COUNT) {
        myApp.alert("شما به آخرین مرحله بازی رسیده اید", "");
        return;
    }
    var hardness;
    var parts = 30;
    if (level < 30) {
        rowCount = 3;
        colCount = 3;
    }
    else if (level < 60) {
        rowCount = 4;
        colCount = 3;
    }
    else if (level < 90) {
        rowCount = 5;
        colCount = 3;
    }
    else if (level < 120) {
        rowCount = 4;
        colCount = 4;
    }
    else {
        rowCount = 5;
        colCount = 4;
    }
    var shaer = $(".shaerImage-selected").data().shaer;
    var beyts;
    if (shaer === "hafez") {
        beyts = hafez_map[rowCount * colCount];
    }
    else if (shaer === "sadi") {
        beyts = sadi_map[rowCount * colCount];
    }
    else {
        beyts = molavi_map[rowCount * colCount];
    }
    var currentLevels = levels[rowCount * colCount];
    var randomBeyt = beyts[level - 1];
    var randomLevel = currentLevels[Math.floor(Math.random() * currentLevels.length)];
    renderTable(rowCount, colCount, randomBeyt, randomLevel);

    $("#playAnswerBoxInner").css("width", ($("#playAnswerBox").width() - 10) + "px");
    $("#playAnswerBoxInner").css("height", ($("#playAnswerBox").height() - 10) + "px");
    $("#playAnswerBoxInner").css("margin-right", "5px");


}

function renderTable(rowCount, colCount, beyt, level) {
    var mesras = beyt.split("@");
    var mesra1 = mesras[0];
    var mesra2 = mesras[1];
    var parts = mesra1.split(" ").concat(mesra2.split(" "));
    var width = $("#playContainer").width() / colCount;
    var height = $("#playContainer").height() / rowCount;
    var counter = 0;
    for (var i = 0; i < rowCount; i++) {
        for (var j = 0; j < colCount; j++) {
            var cell = $("<div></div>");
            cell.attr("id", "cell_" + counter);
            cell.addClass("playCell");
            cell.css("border-top", "solid 1px transparent");
            cell.css("border-right", "solid 1px transparent");
            cell.css("width", (width - 1) + "px");
            cell.css("height", (height - 1) + "px");
            if (i === rowCount - 1) {
                cell.css("height", (height - 2) + "px");
                cell.css("border-bottom", "solid 1px transparent");
            }
            if (j === colCount - 1) {
                cell.css("width", (width - 2) + "px");
                cell.css("border-left", "solid 1px transparent");
            }
            $("#playContainer").append(cell);

            var cellInner = $("<div></div>").addClass("playCellInner");
            cell.append(cellInner);
            cellInner.html(parts[level[counter]]);
            if (level[counter] === 0 || level[counter] === mesra1.split(" ").length) {
                cellInner.addClass("startCell");
            }
            counter++;
        }
    }
    $("#firstSentence").data("answer", mesra1);
    $("#secondSentence").data("answer", mesra2);

    $("#firstSentence").data("found", false);
    $("#secondSentence").data("found", false);
    bindEvents();


}

function bindEvents() {
    bindTouchEvents();
    bindMouseEvents();
}

function bindMouseEvents() {
    var accumulator = "";
    var isMouseDown = false;
    $(".playCellInner")
        .mousedown(function () {
            isMouseDown = true;
            if (!$(this).hasClass("highlighted")) {
                $(this).toggleClass("highlighted");
                accumulator += (" " + $(this).html());
                checkMatch(accumulator);
            }
            return false;
        })
        .mouseover(function () {
            if (isMouseDown) {
                if (!$(this).hasClass("highlighted")) {
                    $(this).toggleClass("highlighted");
                    accumulator += (" " + $(this).html());
                    checkMatch(accumulator);
                }
            }
        });
    $(document)
        .mouseup(function () {
            isMouseDown = false;
            $(".highlighted").toggleClass("highlighted");
            accumulator = "";
        });
}

function bindTouchEvents() {

    var touchF = function (e) {
        e.preventDefault();
        var touch = e.originalEvent.touches[0];
        highlightHoveredObject(touch.clientX, touch.clientY);
        /*var item = $(document.elementFromPoint(touch.clientX, touch.clientY));
         if (!item.hasClass('highlighted') && item.hasClass('playCellInner')) {
         item.addClass('highlighted')
         accumulator += (" " + item.html());
         checkMatch(accumulator, mesra1, mesra2);
         }*/
    };
    $('#playContainer').bind({
        touchstart: touchF,
        touchmove: touchF,
        touchend: function () {
            $(".highlighted").removeClass('highlighted');
            $("#firstSentence").data("accumulator", "");
            $("#blackboard").html("");
        }
    });
}
function highlightHoveredObject(x, y) {

    $('.playCellInner').each(function () {
        // check if is inside boundaries
        if (!(
            x <= $(this).offset().left || x >= $(this).offset().left + $(this).outerWidth() ||
            y <= $(this).offset().top || y >= $(this).offset().top + $(this).outerHeight()
            )) {

            if (!$(this).hasClass('highlighted') && $(this).hasClass('playCellInner')) {
                $(this).addClass('highlighted')
                var oldValue = $("#firstSentence").data("accumulator");
                if (oldValue === undefined) {
                    oldValue = "";
                }
                var newValue = oldValue + (" " + $(this).html());
                $("#firstSentence").data("accumulator", newValue);

                checkMatch(newValue);
            }
        }
    });
}
function checkMatch(accumulator) {
    var mesra1 = $("#firstSentence").data().answer;
    var mesra2 = $("#secondSentence").data().answer;

    if (accumulator.trim() === mesra1) {
        $(".highlighted").css("visibility", "hidden");
        $("#firstSentence").html(mesra1);
        $("#firstSentence").data("found", true);
    }
    if (accumulator.trim() === mesra2) {
        $(".highlighted").css("visibility", "hidden");
        $("#secondSentence").html(mesra2);
        $("#secondSentence").data("found", true);
    }
    if ($("#secondSentence").data().found && $("#firstSentence").data().found) {
        myApp.alert(mesra1 + "   " + mesra2, "");
        goToNextLevel();
        loadLevel();
    }
}

function gotoMain() {
    window.location = "index.html";
}

function setPlayingLevel(val) {
    localStorage.setItem(StorageFields.PLAYING_LEVEL, val);
}

function getPlayingLevel() {
    return parseInt(localStorage.getItem(StorageFields.PLAYING_LEVEL));
}