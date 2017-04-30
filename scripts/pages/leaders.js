myApp.onPageInit('leaders', function (page) {
    if(getCurrentUser()==null){
        myApp.alert(MSG_LOGIN_FIRST,"");
        myApp.loadPage("index");
        return;
    }
    $("#leaderContainer").empty();
    $.ajax({
        url: baseUrl + "users/leaders",
        type: "POST",
        data: JSON.stringify({"status":10}),
        contentType: "application/json",
        success: function (leaders) {
            for (var i = 0; i < leaders.length; i++) {
                var linkParam=true;
                if (getCurrentUser().id==leaders[i].id){
                    linkParam=undefined;
                }
                else if($.inArray(leaders[i].id,GLOBALS.friendIds)>=0){
                    linkParam=undefined;
                }
                $("#leaderContainer").append(renderPerson(leaders[i], i,linkParam));
            }
            $(".users-container").find(".row").css("width", "100%");
        }
    });
});