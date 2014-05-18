var startApp = function() {

    var deviceItemBindings = {
        name: '[name="name"]',
        id: {selector: '[name="name"]', elAttribute: 'href', converter: function() { return this.model.getUrl(); } }
    };

    // Instantiate models
    app.collections = {
        devices: new DeviceCollection(),
        alerts: new AlertCollection(),
        users: new UserCollection()
    };

    // TODO: work out what to do with nested views
    var deviceListView = new ListView({
        collectionContainer: $("#devices_list"),
        itemTemplateId: "deviceListItemTemplate",
        collection: app.collections.devices,
        bindings: deviceItemBindings
    });

    // Disable jQM route handling so we can get Backbone to do it
    $(document).on( "mobileinit",
        function() {
            // Prevents all anchor click handling including the addition of active button state and alternate link blurring.
            $.mobile.linkBindingEnabled = false;

            // Disabling this will prevent jQuery Mobile from handling hash changes
            $.mobile.hashListeningEnabled = false;
        }
    )

    // Instantiate the route which will manage all view and navigation. Each view will instantiate any
    // models it needs.
    app.router = new Router();
};