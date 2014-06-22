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
    var userData = {
        username: "Fred"
    },
    userInitSpy = sinon.spy(UserModel.prototype, 'initialize'),
    users,
    user;

    // User should fail with no username
    try {
        var userWithNoName = new UserModel();
    }
    catch (e) {}

    equal("No username provided", userInitSpy.exceptions[0].message, "Exception on no username provided");
    UserModel.prototype.initialize.restore();

    // Add a valid user
    users = new UserCollection();
    user = users.add(new UserModel(userData));
    var saving = user.save();

    stop();
    saving.done(function() {
        equal(user.id, userData.username, "User has correct id");
        equal(user.get("devices").size(), 0, "User has no devices");
        equal(user.get("alerts").size(), 0, "User has no alerts");
        user.destroy();
        start();
    });
});

test("Load devices for a user", function () {
    var user = new UserModel({username: 'test'}),
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

        user.destroy();
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
        equal(device.get("variables").analogvalue, deviceData.variables.analogvalue, "Device has some variables");
        equal(device.get("functions").length, 1, "Device has some functions");
        start();
    });

    requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify(deviceData));
});

test("Instantiate an alert", function () {
    var users = new UserCollection(),
        user = users.add({username: 'test'}),
        device = user.devices.add({
            id: "55ff6e065075555333260287"
        }),
        alertId = null,
        alertData = {
            deviceId: null,
            name: "My Alert",
            checkInterval: 5,
            startTime: "00:00",
            endTime: "00:00",
            variable: "",
            valueExpression: "",
            message: "Alert"
        };

    var alert = user.alerts.add(alertData);
    ok(alert.isNew(), "Alert has not been saved");
    ok(!alert.id, "Alert has no id");

    // Associate an alert with a device
    alert.set("device", device);
    equal(alert.get("device").get("id"), device.get("id"), "Device added to alert");

    // Need to save the alert before we can save the user
    alert.save();

    // We can test local storage here, so save the user and then try to recreate it.
    var onAlertSaved = function() {
        return user.save();
    };

    var onUserSaved = function() {
        // Try loading the saved model via the collection
        user.alerts.reset();
        equal(user.alerts.size(), 0, "Alerts cleared");
        return user.alerts.fetch();
    };

    var onAlertsLoaded = function() {
        equal(user.alerts.length, 1, "User has correct number of alerts");
        equal(alert.get("id"), user.alerts.models[0].get("id"), "Loaded alert has correct id");
        equal(alertData.name, user.alerts.models[0].get("name"), "Loaded alert has correct name");
    };

    var tidyUp = function() {
        return user.alerts
            .removeAll()
            .then(function() {
                equal(user.alerts.length, 0, "User alert have been cleared");
                return user.destroy();
            })
            .done(function() {
                // TODO: Confirm that the user has been destroyed
                start();
            });
    };

    stop();
    alert.save()
        .then(onAlertSaved)
        .then(onUserSaved)
        .then(onAlertsLoaded)
        .then(tidyUp);
});