var xhr,
    requests;

module("Models", {
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
            access_token: 'abc'
        };

    stop();

    var gettingUser = (new UserCollection()).getAuthorisedUser(credentials);

    gettingUser.done(function(user) {
        equal(user.get("username"), authResponse.username, "User has correct username");
        equal(user.get("authToken"), authResponse.access_token, "User has correct auth token");
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

test("Instantiate a device", function () {
    var deviceData = {
            id: "55ff6e065075555333260287",
            name: "core1",
            connected: true,
            variables: {
                analogvalue: "int32"
            },
            functions: [
                "testFunction"
            ]
        },
        collection = new DeviceCollection(),
        device = collection.add({
            id: "55ff6e065075555333260287"
        });

    stop();
    device.fetch().done(function(deviceData) {
        var re = new RegExp(collection.url + "/" + device.get("id") + "$");
        ok(re.test(requests[0].url), "Request has correct url");
        equal(device.get("id"), deviceData.id, "Device has correct id");
        equal(device.get("name"), deviceData.name, "Device has correct name");
        equal(device.alerts.size(), 0, "Device has no alerts");
        equal(device.get("variables").analogvalue, deviceData.variables.analogvalue, "Device has some variables");
        equal(device.get("functions").length, 1, "Device has some functions");
        start();
    });

    requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify(deviceData));
});

