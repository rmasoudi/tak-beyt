myApp.onPageInit('menu', function (page) {
    if(getCurrentUser()==null){
        myApp.alert(MSG_LOGIN_FIRST,"");
        myApp.loadPage("index");
        return;
    }
    loadUserInfo();
    if (getCurrentUser() != null) {
        mainView.loadPage("menu.html");
    }
});