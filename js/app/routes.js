// Extends Backbone.Router
var Router = Backbone.Router.extend( {

    // The Router constructor
    initialize: function() {
        // Instantiates a new Login View if it doesn't already exist, create a model and bind it to the model
        var self = this;
        this.loginView = new PageView({
            model: new LoginModel(),
            container: $("#login"),
            bindings: {
                "username": '[name = "username"]',
                "password": '[name = "password"]'
            },
            on_submit: function () {
                PubSub.publish("loading");
                app.collections.users.getAuthorisedUser({
                    username: this._model.get("username"),
                    password: this._model.get("password")
                }).done(function() {
                    // We have an authorised user so go to the user page
                    self.user();
                }).fail(function() {
                    // Display the error
                    console.log("on_submit: Invalid login details");
                }).always(function() {
                    PubSub.publish("stoppedLoading");
                });
            }
        });

        // Instantiates a new User View
        this.devicesView = new PageView({
            model: new UserModel(),
            container: $("#user"),
            bindings: {
                "id": '[name = "id"]',
                "name": '[name = "name"]'
                // TODO: list devices
            }
        });

        // Instantiates a new Device View
        this.devicesView = new PageView({
            model: new DeviceModel(),
            container: $("#device"),
            bindings: {
                "id": '[name = "id"]',
                "name": '[name = "name"]'
                // TODO: list variables and functions
            }
        });

        // Instantiates a new Alert View
        this.alertView = new PageView({
            model: new AlertModel(),
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
        this.loginView.render();
        $.mobile.changePage( "#login" , { reverse: false, changeHash: false } );
    },
    user: function() {
        // Fetches the collection of device models for the current login
        this.devicesView.collection.fetch().done( function() {
            this.devicesView.render();
            $.mobile.changePage( "#devices", { reverse: false, changeHash: false } );
        });

        $.mobile.changePage( "#devices" , { reverse: false, changeHash: false } );
    },
    device: function(id) {
        $.mobile.changePage( "#device" , { reverse: false, changeHash: false } );
    },
    alert: function() {
        $.mobile.changePage( "#alert" , { reverse: false, changeHash: false } );
    }
});
