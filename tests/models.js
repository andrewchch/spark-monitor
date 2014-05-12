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
    var user = new UserModel(),
        devices = [
            {
                id: "123",
                name: "My Device"
            }];

    stop();

    var fetchingDevices = user.devices.fetch();

    fetchingDevices.done(function() {
        var deviceCollection = user.devices,
            firstModel = deviceCollection.models[0];

        equal(deviceCollection.size(), devices.length, "Devices fetched for user");
        equal(firstModel.get("id"), devices[0].id, "Device has correct id");
        equal(firstModel.get("name"), devices[0].name, "Device has correct name");
        start();
    });

    requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify(devices));
});

test("Instantiate a device", function () {
    var device = new DeviceModel();
    var alerts = device.get("alerts");
    equal(device.get("id"), "", "Device has correct id");
    equal(alerts.size(), 0, "Device has no alerts");
});

