var startApp = function() {

    // Set up view bindings
    var loginViewBindings = {
        "username": '[name = "username"]',
        "password": '[name = "password"]'
    };

    var deviceViewBindings = {
        "id": '[name = "id"]',
        "name": '[name = "name"]'
    };

    var alertViewBindings = {
        "id": '[name = "id"]',
        "name": '[name = "name"]',
        "deviceId": '[name = "deviceId"]',
        "checkInterval": '[name = "checkInterval"]',
        "startTime": '[name = "startTime"]',
        "endTime": '[name = "endTime"]',
        "endTime": '[name = "endTime"]',
        "message": '[name = "message"]'
    };

    var deviceItemBindings = {
        name: '[name="name"]',
        id: {selector: '[name="name"]', elAttribute: 'href', converter: function() { return this.model.getUrl(); } }
    };

    // Instantiate models
    var devices = new DeviceCollection(),
        alerts = new AlertCollection(),
        users = UserCollection();

    // Instantiate the views
    var deviceView = new BaseView({
        model: DeviceModel,
        templateId: "device-edit-template",
        bindings: deviceViewBindings
    });

    // Formatters
    var device

    var deviceListView = new ListView({
        collectionContainer: $("#devices_list"),
        itemTemplateId: "deviceListItemTemplate",
        collection: devices,
        bindings: deviceItemBindings
    });

};