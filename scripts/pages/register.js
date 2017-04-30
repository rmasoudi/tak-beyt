myApp.onPageInit('register', function (page) {
    $$("#txtRegisterName").focus();

    $$("#btnRegister").on('click', function () {
        var name = $$("#txtRegisterName").val();
        var userName = $$("#txtRegisterUserName").val();
        var password = $$("#txtRegisterPassword").val();
        var passwordRep = $$("#txtRegisterPasswordRep").val();
        var gender = $$("#rdoGender").prop("checked");
        var location = {latitude: 0, longitude: 0};
        if (gender === null || gender === undefined) {
            gender = false;
        }
        if (name == "" || userName == "" || password == "" || passwordRep == "") {
            myApp.alert(MSG_FILL, "");
            return;
        }
        if (password.length < 6) {
            myApp.alert(MSG_PASS_LENGTH, "");
            return;
        }
        if (password != passwordRep) {
            myApp.alert(MSG_PASS_MISMATCH, "");
            return;
        }
        var data = JSON.stringify({"name": name, "userName": userName, "password": password, "gender": gender, "latitude": location.latitude, "longitude": location.longitude});
        $.ajax({
            url: baseUrl + "users/register",
            data: data,
            method: "POST",
            contentType: "application/json",
            success: function (result) {
                setCurrentUser(result);
                setAuthToken(result);
                mainView.loadPage("register2.html");
            },
            error: function (obj) {

            }
        });

    });
});

myApp.onPageInit('register2', function (page) {
    loadCities();
    $$("#btnRegister2").on("click", function () {
        if (selectedCityId === null || selectedCityId === undefined) {
            myApp.alert("هیچ شهری انتخاب نشده است", "");
            return;
        }
        var user = getCurrentUser();
        if (user === null || user.id === null) {
            mainView.loadPage("register.html");
            return;
        }
        user.cityId = selectedCityId;
        var data = JSON.stringify(user);
        $.ajax({
            url: baseUrl + "users/setcity",
            data: data,
            method: "POST",
            contentType: "application/json",
            success: function (result) {
            },
            error: function (obj) {

            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": getAuthToken()
            }
        });
    });
});