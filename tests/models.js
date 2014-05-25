var xhr,
    requests;

module("UserModel", {
    setup: function () {
        xhr = sinon.useFakeXMLHttpRequest();
        requests = [];

        xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
    },

    tearDown: function () {
        xhr.restore();
    }
});

test("Instantiate a user", function () {
    var user = new UserModel({
        id: 1
    });
    var devices = user.get("devices");
    equal(user.get("id"), 1, "User has correct id");
    equal(devices.size(), 0, "User has no devices");
});

test("Load devices for a user", function () {
    var user = new UserModel({id: 1}),
        devices = [
            {
                id: "123",
                name: "My Device"
            }];

    stop();

    var loadingDevices = user.loadDevices();

    loadingDevices.done(function() {
        var deviceCollection = user.devices,
            firstModel = deviceCollection.models[0];

        equal(deviceCollection.size(), devices.length, "Devices fetched for user");
        equal(firstModel.get("id"), devices[0].id, "Device has correct id");
        equal(firstModel.get("name"), devices[0].name, "Device has correct name");
        equal(firstModel.get("deviceFor").toString(), user.toString(), "Device belongs to a user");
        start();
    }).fail(function() {
        console.log('failed');
    });

    requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify(devices));
});

test("Get an authenticated user that doesn't exist in the collection", function () {
    var credentials = {
            username: 'test@blah.com',
            password: '123'
        },
        authResponse = {
            username: credentials.username,
            auth_token: 'abc'
        };

    stop();

    var gettingUser = (new UserCollection()).getAuthorisedUser(credentials);

    gettingUser.done(function(user) {
        equal(user.get("username"), authResponse.username, "User has correct username");
        equal(user.get("authToken"), authResponse.auth_token, "User has correct auth token");
        start();
    });

    requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify(authResponse));
});

test("Get an authenticated user that does exist in the collection", function () {
    var userData = {
            username: 'test@blah.com',
            authToken: 'abc'
        };

    var users = new UserCollection(),
        user = users.add(userData),
        gettingUser = users.getAuthorisedUser(userData);

    stop();

    gettingUser.done(function(user) {
        equal(user.get("username"), userData.username, "User has correct username");
        equal(user.get("authToken"), userData.authToken, "User has correct auth token");
        start();
    });
});

module("DeviceModel");

test("Instantiate a device", function () {
    var device = new DeviceModel();
    var alerts = device.get("alerts");
    equal(device.get("id"), "", "Device has correct id");
    equal(alerts.size(), 0, "Device has no alerts");
});

