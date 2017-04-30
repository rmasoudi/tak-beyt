function setAuthToken(user) {
    localStorage.setItem(StorageFields.AUTH_TOKEN, "Basic " + btoa(user.userName + ":" + user.password));
}
function getAuthToken() {
    return localStorage.getItem(StorageFields.AUTH_TOKEN);
}

function setCurrentUser(user) {
    localStorage.setItem(StorageFields.CURRENT_USER, JSON.stringify(user));
}

function getCurrentUser() {
    if (localStorage.getItem(StorageFields.CURRENT_USER) === undefined) {
        return null;
    }
    return JSON.parse(localStorage.getItem(StorageFields.CURRENT_USER));
}

function updateGeoLocation() {
    var geo = navigator.geolocation;
    if (geo !== undefined) {
        geo.getCurrentPosition(function success(pos) {
            var currentUser = getCurrentUser();
            if (pos.coords.latitude !== undefined) {
                currentUser.latitude = pos.coords.latitude;
                currentUser.longitude = pos.coords.longitude;
            }
            else {
                currentUser.latitude = 0;
                currentUser.longitude = 0;
            }
        }, function error() {
        });
    }

}

function updateCurrentUser(name, cityId) {
    var user = getCurrentUser();
    if (name != null) {
        user.name = name;
    }
    if (cityId != null) {
        user.cityId = cityId;
    }
    setCurrentUser(user);
}
function changePassword(password) {
    var user = getCurrentUser();
    if (password != null) {
        user.password = password;
    }
    setCurrentUser(user);
}

function insertMessage(partnerId, message) {
    var messages = getPartnerMessages(partnerId);
    messages.push(message);
    setPartnerMessages(partnerId, messages);
}

function deleteMessage(partnerId, messageId) {
    var messages = getPartnerMessages(partnerId);
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].id == messageId) {
            messages.splice
        }
    }
    setPartnerMessages(partnerId, messages);
}

function getPartnerMessages(partnerId) {
    var obj = localStorage.getItem(StorageFields.MESSAGES_PREFIX + partnerId);
    if (obj === null || obj === undefined) {
        return [];
    }
    return JSON.parse(obj);
}
function setPartnerMessages(partnerId, messages) {
    localStorage.setItem(StorageFields.MESSAGES_PREFIX + partnerId, JSON.stringify(messages));
}

function syncUser() {
    if (getCurrentUser() == null) {
        return;
    }
    $.ajax({
        url: baseUrl + "users/syncuser",
        type: "POST",
        data: JSON.stringify(getCurrentUser()),
        contentType: "application/json",
        success: function () {

        }
    });
}