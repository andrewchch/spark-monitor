var LoginModel = Backbone.Model.extend({
    defaults: {
        username: "",
        password: ""
    }
});

var AlertModel = Backbone.RelationalModel.extend({
    idAttribute: "id",
    url: "alert", // Doesn't get used because of localstorage, not sure why it's required
    relations: [{
        type: Backbone.HasOne,
        key: 'device',
        relatedModel: DeviceModel,
        reverseRelation: {
            key: 'alertFor',
            includeInJSON: 'id'
        }
    }],
    defaults: {
        id: null,
        name: "",
        checkInterval: 5,
        startTime: "00:00",
        endTime: "00:00",
        variable: "",
        valueExpression: "",
        message: "Alert"
    }
});

var AlertCollection = Backbone.Collection.extend({
    model: AlertModel,
    localStorage: new Backbone.LocalStorage("Alert"),
    removeAll: function() {
        var self = this,
            promises = [];

        this.each(function(model) {
            promises.push(model.destroy());
        });

        return $.when(promises);
    }
});

var DeviceModel = Backbone.RelationalModel.extend({
    idAttribute: "id",
    defaults:{
        id: "",
        name: "",
        connected: false,
        variables: {},
        functions: []
    },
    getUrl: function() {
        return '?id=' + this.get("id") + '#device';
    }
});

var DeviceCollection = Backbone.Collection.extend({
    model: DeviceModel,
    url: '/v1/devices'
});

var UserModel = Backbone.RelationalModel.extend({
    url: "user", // Doesn't get used because of localstorage, not sure why it's required
    idAttribute: "username",
    defaults:{
        username: "",
        authToken: ""
    },
    relations: [
        {
            type: Backbone.HasMany,
            key: 'devices',
            relatedModel: DeviceModel,
            collectionType: DeviceCollection,
            reverseRelation: {
                key: 'deviceFor',
                includeInJSON: 'id'
            }
        },
        {
            type: Backbone.HasMany,
            key: 'alerts',
            relatedModel: AlertModel,
            collectionType: AlertCollection,
            reverseRelation: {
                key: 'alertFor',
                includeInJSON: 'id'
            }
        }
    ],
    loadDevices: function() {
        var self = this;

        return this.devices.fetch({
            data: {
                access_token: this.get("authToken")
            }
        }).pipe(function(devices) {
            // Need to associated each loaded device with the user
            _.each(self.devices.models, function(device) {
                device.set("deviceFor", self);
            });
        });
    },
    initialize: function(opts) {
        if (!(opts && opts.username)) {
            throw new Error("No username provided");
        }

        this.set("id", opts.username);
        this.devices = new DeviceCollection();
        this.alerts = new AlertCollection();
    },
    toString: function() {
        return '<User ' + this.get("id") + ">";
    }
});

var UserCollection = Backbone.Collection.extend({
    model: UserModel,
    localStorage: new Backbone.LocalStorage("User"),
    currentUser: null,
    initialize: function() {
        this.fetch();
    },
    getAuthorisedUser: function(credentials) {
        // See if we have an existing user with an auth token.
        var user = this.get(credentials.username),
            self = this;

        if (user && user.get("authToken")) {
            return new $.Deferred().resolve(user);
        }

        // No user or user has no auth token (how likely is that?) so
        // we need to authenticate with the [provided credentials.
        var loginDone = function (response) {
                user = user || self.add({
                    username: credentials.username
                });
                user.set("authToken", response.access_token);
                self.setCurrentUser(user);
                return user;
            },
            loginFail = function () {
                console.log("Invalid login details");
            };

        return SparkApi.login({
            username: credentials.username,
            password: credentials.password
        }).pipe(loginDone, loginFail);
    },
    setCurrentUser: function(user) {
        this.currentUser = user;
    },
    getCurrentUser: function() {
        // For now, we'll set the current user to whoever last logged in.
        // Logging in is the process of confirming your credentials, since we don't want
        // to save passwords and this app only works online anyway.
        return this.currentUser;
    }
});