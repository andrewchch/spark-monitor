// Extends Backbone.Router
var Router = Backbone.Router.extend( {

    // The Router constructor
    initialize: function() {
        // Instantiates a new Login View if it doesn't already exist, create a model and bind it to the model
        var self = this;
        this.loginView = new AppViews.LoginView({id: "login", title: "Login", contentTemplate: "login-page-template"});
        this.userView = new AppViews.UserView({id: "user", title: "User", contentTemplate: "user-page-template"});
        this.deviceView = new AppViews.DeviceView({id: "device", title: "Device", contentTemplate: "device-page-template"});
        this.alertView = new AppViews.AlertView({id: "alert", title: "Alert", contentTemplate: "alert-page-template"});

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
    // TODO: I think we need to clean up old jQM pages manually?
    login: function() {
        this.loginView.render();
        this.changePage("login");
    },
    user: function(user) {
        var self = this;
        this.userView
            .setModel(user)
            .loadDevices().done( function() {
                self.userView.render();
                self.changePage("user");
            });
    },
    device: function(id) {
        var self = this,
            user = app.collections.users.getCurrentUser(),
            device = user && user.devices.get(id);

        if (!user) {
            this.login();
            return true;
        }

        if (!device) {
            // TODO: Show invalid device message?
            console.log('Invalid device: ' + id);
            return;
        }

        this.deviceView.setModel(device);
        this.deviceView.render();
        self.changePage("device");
    },
    alert: function() {
        self.changePage("alert");
    },
    changePage: function (pageId, opts) {
        this.navigate(pageId);
    }
});
