myApp.onPageInit('profile', function (page) {
    if(getCurrentUser()==null){
        myApp.alert(MSG_LOGIN_FIRST,"");
        myApp.loadPage("index");
        return;
    }
    $("#imageHolder").empty();
    $("<img />", {
        "src": $("#imgUser").attr("src"),
        "class": "thumb-image"
    }).appendTo($("#imageHolder"));
    loadUserInfo();
    loadCities();
    var user = getCurrentUser();
    $("#txtEditName").val(user.name);
    loadSelectedCity(user);
    var fileToUpload = null;
    $("#fileUpload").on('change', function (event) {
        fileToUpload = event.target.files[0];
        var image_holder = $("#imageHolder");
        image_holder.empty();
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#imageHolder").empty();
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image"
                }).appendTo(image_holder);
            }

            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        }
    });
    $("#btnUploadImage").on("click", function () {
        var data = new FormData();
        var file = $("#fileUpload")[0].files[0];
        if (file == null || file == undefined) {
            myApp.alert(MSG_NO_FILE_SELECTED);
        }
        data.append("file", file);
        $.ajax({
            url: baseUrl + "users/upload",
            type: "POST",
            data: data,
            processData: false,
            contentType: false,
            success: function () {
                $("#imgUser").attr("src", $(".thumb-image").attr("src"));
            }
        });
    });

    $("#btnEditDetails").on("click", function () {
        var name = $$("#txtEditName").val();
        if (name === "" || name === getCurrentUser().name) {
            name = null;
        }
        var cityId = selectedCityId;
        if (cityId === 0 || cityId === undefined || cityId === getCurrentUser().cityId) {
            cityId == null;
        }
        if (name === null && cityId === null) {
            return;
        }
        var data = JSON.stringify({"name": name, "cityId": cityId, "id": getCurrentUser().id});
        $.ajax({
            url: baseUrl + "users/edit",
            data: data,
            method: "POST",
            contentType: "application/json",
            success: function (result) {
                updateCurrentUser(name, cityId);
                loadUserInfo();
            },
            error: function (obj) {

            }
        });
    });

    $("#btnChangePassword").on("click", function () {
        var password = $$("#txtEditPassword").val();
        var passwordRep = $$("#txtEditPasswordRep").val();
        if (password.length < 6) {
            myApp.alert(MSG_PASS_LENGTH, "");
            return;
        }
        if (password != passwordRep) {
            myApp.alert(MSG_PASS_MISMATCH, "");
            return;
        }
        var data = JSON.stringify({"password": password, "id": getCurrentUser().id});
        $.ajax({
            url: baseUrl + "users/changepass",
            data: data,
            method: "POST",
            contentType: "application/json",
            success: function (result) {

            },
            error: function (obj) {

            }
        });
    });
});

function loadSelectedCity(user) {
    if (user.cityId != null && user.cityId != undefined && user.cityId != 0) {
        var state = null;
        var city = null;
        for (var i = 0; i < states.length; i++) {
            for (var j = 0; j < states[i].cities.length; j++) {
                if (states[i].cities[j].id == user.cityId) {
                    state = states[i];
                    city = states[i].cities[j];
                }
            }
        }
        $("#city-dropdown").val(city.name);
        $("#state-dropdown").val(state.name);
    }
}