init();
myApp.onPageInit('index', function (page) {
    init();
});
function init() {
    loadLevel();
    $(".shaerImage").click(function () {
        $(".shaerImage").removeClass("shaerImage-selected");
        $(this).addClass("shaerImage-selected");
        loadLevel();
    });
}

function getLevel() {
    var level = localStorage.getItem(StorageFields.LEVEL);
    if (level === null || level === undefined) {
        level = 0;
        localStorage.setItem(StorageFields.LEVEL, 0);
    }
    return parseInt(level);
}
function goToNextLevel() {
    var shaer = $(".shaerImage-selected").data().shaer;
    localStorage.setItem(StorageFields.LEVEL, getLevel() + 1);
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
    var level = getLevel();
    $("#lblLevel").html(level + 1);
    $("#firstSentence").html("");
    $("#secondSentence").html("");
    $("#playContainer").html("");
    $("#firstSentence").data("found", false);
    $("#secondSentence").data("found", false);
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
    var randomBeyt = beyts[Math.floor(Math.random() * beyts.length)];
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
            if (level[counter] === 0) {
                cellInner.addClass("startCell");
            }
            counter++;
        }
    }
    bindEvents(mesra1, mesra2);
}

function bindEvents(mesra1, mesra2) {
    bindTouchEvents(mesra1, mesra2);
    bindMouseEvents(mesra1, mesra2);
}

function bindMouseEvents(mesra1, mesra2) {
    var accumulator = "";
    var isMouseDown = false;
    $(".playCellInner")
        .mousedown(function () {
            isMouseDown = true;
            if (!$(this).hasClass("highlighted")) {
                $(this).toggleClass("highlighted");
                accumulator += (" " + $(this).html());
                checkMatch(accumulator, mesra1, mesra2);
            }
            return false;
        })
        .mouseover(function () {
            if (isMouseDown) {
                if (!$(this).hasClass("highlighted")) {
                    $(this).toggleClass("highlighted");
                    accumulator += (" " + $(this).html());
                    checkMatch(accumulator, mesra1, mesra2);
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

function bindTouchEvents(mesra1, mesra2) {
    var accumulator = "";
    var touchF = function (e) {
        var touch = e.originalEvent.touches[0];
        var item = $(document.elementFromPoint(touch.clientX, touch.clientY));
        if (!item.hasClass('highlighted') && item.hasClass('playCellInner')) {
            item.addClass('highlighted')
            accumulator += (" " + item.html());
            checkMatch(accumulator, mesra1, mesra2);
        }
    };
    $('#playContainer').bind({
        touchstart: touchF,
        touchmove: touchF,
        touchend: function () {
            $(".highlighted").removeClass('highlighted');
            accumulator = "";
        }
    });
}

function checkMatch(accumulator, mesra1, mesra2) {
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