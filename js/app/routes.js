// Extends Backbone.Router
var Router = Backbone.Router.extend( {

    // The Router constructor
    initialize: function() {
        // Instantiates a new Login View if it doesn't already exist, create a model and bind it to the model
        var self = this;
        this.loginView = AppViews.loginView;
        this.userView = AppViews.userView;
        this.deviceView = AppViews.deviceView;
        this.alertView = AppViews.alertView;

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
    // TODO: refactor these out into proper controllers
    login: function() {
        this.loginView.render();
        $.mobile.changePage( "#login" , { reverse: false, changeHash: false } );
    },
    user: function(user) {
        var self = this;
        this.userView
            .setModel(user)
            .loadDevices().done( function() {
                self.userView.render();
                $.mobile.changePage( "#user", { reverse: false, changeHash: false } );
            });
    },
    device: function(id) {
        $.mobile.changePage( "#device" , { reverse: false, changeHash: false } );
    },
    alert: function() {
        $.mobile.changePage( "#alert" , { reverse: false, changeHash: false } );
    }
});
