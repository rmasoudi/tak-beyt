myApp.onPageInit('friendship', function (page) {
    if (getCurrentUser() == null) {
        myApp.alert(MSG_LOGIN_FIRST, "");
        myApp.loadPage("index");
        return;
    }
    $("#btnUserSearch").on("click", function () {
        var query = $("#txtUserSearch").val();
        if (query.length < 3) {
            myApp.alert(MSG_QUERY_SHORT);
            return;
        }
        $.ajax({
            url: baseUrl + "users/searchuser",
            type: "POST",
            data: JSON.stringify({"userId": getCurrentUser().id, "query": query}),
            contentType: "application/json",
            success: function (users) {
                $("#publicContainer").empty();
                for (var i = 0; i < users.length; i++) {
                    $("#publicContainer").append(renderPerson(users[i], null, true));
                }
                $(".users-container").find(".row").css("width", "100%");
            }
        });
    });
    $("#btnGeoSearch").on("click", function () {
        var currentUser = getCurrentUser();
        if (currentUser.latitude == 0 && currentUser.longitude == 0) {
            myApp.alert(MSG_GEO_NOT_FOUND);
            return;
        }
        $.ajax({
            url: baseUrl + "users/searchgeo",
            type: "POST",
            data: JSON.stringify({latitude: currentUser.latitude, longitude: currentUser.longitude}),
            contentType: "application/json",
            success: function (users) {
                $("#geoContainer").empty();
                if (users.length == 0) {
                    myApp.alert(MSG_GEO_NO_USER);
                    return;
                }
                for (var i = 0; i < users.length; i++) {
                    if (users[i].id != getCurrentUser().id) {
                        $("#geoContainer").append(renderPerson(users[i], null, true));
                    }
                }
                $(".users-container").find(".row").css("width", "100%");
            }
        });
    });
    $("#btnHamSearch").on("click", function () {
        var user = getCurrentUser();
        var cityId = user.cityId;
        if (cityId == null || cityId == undefined || cityId == 0) {
            myApp.alert(MSG_NO_CITY_DEFINED);
        }
        $.ajax({
            url: baseUrl + "users/searchhamshahri",
            type: "POST",
            data: JSON.stringify({"cityId": cityId}),
            contentType: "application/json",
            success: function (users) {
                $("#geoContainer").empty();
                if (users.length == 0) {
                    myApp.alert(MSG_HAM_NO_USER);
                    return;
                }
                for (var i = 0; i < users.length; i++) {
                    if (users[i].id != getCurrentUser().id) {
                        $("#cityContainer").append(renderPerson(users[i], null, true));
                    }
                }
                $(".users-container").find(".row").css("width", "100%");
            }
        });
    });
});