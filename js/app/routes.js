// Extends Backbone.Router
var Router = Backbone.Router.extend( {

    // The Router constructor
    initialize: function() {
        // Instantiates a new User View
        this.devicesView = new PageView({
            model: UserModel,
            container: $("#user"),
            bindings: {
                "id": '[name = "id"]',
                "name": '[name = "name"]'
                // TODO: list devices
            }
        });

        // Instantiates a new Device View
        this.devicesView = new PageView({
            model: DeviceModel,
            container: $("#device"),
            bindings: {
                "id": '[name = "id"]',
                "name": '[name = "name"]'
                // TODO: list variables and functions
            }
        });

        // Instantiates a new Alert View
        this.alertView = new PageView({
            model: AlertModel,
            container: $("#alert"),
            bindings: {
                "id": '[name = "id"]',
                "name": '[name = "name"]',
                "deviceId": '[name = "deviceId"]',
                "checkInterval": '[name = "checkInterval"]',
                "startTime": '[name = "startTime"]',
                "endTime": '[name = "endTime"]',
                "variable": '[name = "variable"]',
                "expression": '[name = "expression"]',
                "message": '[name = "message"]'
            }
        });

        // Tells Backbone to start watching for hashchange events
        Backbone.history.start();
    },

    // Backbone.js Routes
    routes: {
        "login": "login",
        "user": "user",
        "device/:id": "device",
        "alert(/:id)": "alert"
    },

    /*
    These are essentially controllers that the router calls, which will create views, create models,
    bind the views to the models.
    */

    login: function() {
        // Instantiates a new Login View if it doesn't already exist, create a model and bind it to the model
        if (!this.loginView) {

        }
        this.loginView = new PageView({
            model: LoginModel,
            container: $("#login"),
            bindings: {
                "username": '[name = "username"]',
                "password": '[name = "password"]'
            }
        });

        $.mobile.changePage( "#login" , { reverse: false, changeHash: false } );
    },
    user: function() {
        // Fetches the Collection of Category Models for the current Category View
        this.devicesView.collection.fetch().done( function() {
            $.mobile.changePage( "#devices" + type, { reverse: false, changeHash: false } );
        });

        var model = this.devicesView.model;

        $.mobile.changePage( "#devices" , { reverse: false, changeHash: false } );
    },
    device: function(id) {
        $.mobile.changePage( "#device" , { reverse: false, changeHash: false } );
    },
    alert: function() {
        $.mobile.changePage( "#alert" , { reverse: false, changeHash: false } );
    }
});
