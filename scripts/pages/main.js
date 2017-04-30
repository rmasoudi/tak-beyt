init();
myApp.onPageInit('index', function (page) {
    init();
});

function init() {
    loadUserInfo();
    loadFriends();
    $$("#txtLoginUserName").focus();

    $$("#btnLogout").on("click", function () {
        localStorage.clear();
        loadUserInfo();
        $$("#sidePanel").addClass("close-panel");
        mainView.loadPage("index.html");
    });
    $$("#imgUser").on("click", function () {
        $$("#sidePanel").addClass("close-panel");
        mainView.loadPage("profile.html");
    });
    $(".side-item").on("click", function () {
        $$("#sidePanel").addClass("close-panel");
    });
    var selectedCityId = 0;
    $$("#btnLogin").on('click', function () {
        var userName = $$("#txtLoginUserName").val();
        var password = $$("#txtLoginPassword").val();
        if (userName == "" || password == "") {
            myApp.alert(MSG_FILL, "");
            return;
        }
        if (password.length < 6) {
            myApp.alert(MSG_PASS_LENGTH, "");
            return;
        }
        var data = btoa(userName + ":" + password);
        $.ajax({
            url: baseUrl + "users/login",
            data: data,
            method: "POST",
            contentType: "application/json",
            success: function (result) {
                result.password = password;
                setCurrentUser(result);
                setAuthToken(result);
                mainView.loadPage("menu.html");

            },
            error: function (obj) {

            }
        });

    });
}