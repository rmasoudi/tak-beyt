var matrix = null;
myApp.onPageInit('play', function (page) {
    var rowCount = 3;
    var colCount = 3;
    var beyts = hafez_map[rowCount * colCount];
    var currentLevels = levels[rowCount * colCount];
    var randomBeyt = beyts[Math.floor(Math.random() * beyts.length)];
    var randomLevel = currentLevels[Math.floor(Math.random() * currentLevels.length)];
    renderTable(rowCount, colCount, randomBeyt, randomLevel);

    $("#playAnswerBoxInner").css("width", ($("#playAnswerBox").width() - 10) + "px");
    $("#playAnswerBoxInner").css("height", ($("#playAnswerBox").height() - 10) + "px");
    $("#playAnswerBoxInner").css("margin-right", "5px");
});

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
            counter++;
        }
    }
    matrix = $('.playCellInner').map(function () {
        var e = $(this),
            o = e.offset(),
            w = e.width(),
            h = e.height();

        return {
            top: o.top,
            left: o.left,
            right: o.left + w,
            bottom: o.top + h,
            e: e
        };
    }).get();
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
        myApp.alert("شما برنده شدید", "");
    }
}
function bindTouchEvents(mesra1, mesra2) {

    var currentTarget = $(), activeTarget = $();
    var touchF = function (e) {
        var touch = e.originalEvent.touches[0];
        currentTarget = getCurrent(
            {
                clientX: touch.clientX,
                clientY: touch.clientY
            }
        );
        alert(JSON.stringify(e.originalEvent));
        alert(document.elementFromPoint(touch.clientX,touch.clientY));
        if (currentTarget && currentTarget !== activeTarget) {
            activeTarget = currentTarget;
            activeTarget.toggleClass('highlighted');
        }
    };
    $('#playContainer').bind({
        touchstart: touchF,
        touchmove: touchF
    });
}

function getCurrent(touch) {
    var a = matrix.filter(function (obj) {
        var b = (
        touch.clientX > obj.left &&
        touch.clientX < obj.right &&
        touch.clientY < obj.bottom &&
        touch.clientY > obj.top
        );

        return b;
    });
    return a.length > 0 ? a[0].e : null;
}