var LoginModel = Backbone.Model.extend({
    defaults: {
        username: "",
        password: ""
    }
});

var AlertModel = Backbone.RelationalModel.extend({
    idAttribute: "id",
    defaults: {
        id: null,
        deviceId: null,
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
    localStorage: new Backbone.LocalStorage("Alerts"),
    initialize: function() {
        this.fetch();
    }
});

var DeviceModel = Backbone.Model.extend({
    idAttribute: "id",
    defaults:{
        id: "",
        name: "",
        variables: [],
        functions: [],
        alerts: new AlertCollection()
    },
    getUrl: function() {
        return '?id=' + this.get("id") + '#device/';
    },
    relations: [{
        type: Backbone.HasMany,
        key: 'alerts',
        relatedModel: 'Alert',
        collectionType: 'AlertCollection',
        reverseRelation: {
            key: 'alertFor',
            includeInJSON: 'id'
        }
    }]
});

var DeviceCollection = Backbone.Collection.extend({
    model: DeviceModel,
    url: '/v1/devices'
    /*
    ,localStorage: new Backbone.LocalStorage("Devices"),
    initialize: function() {
        this.fetch();
    }
     */
});

var UserModel = Backbone.Model.extend({
    idAttribute: "username",
    defaults:{
        username: "",
        authToken: "",
        devices: new DeviceCollection()
    },
    relations: [{
        type: Backbone.HasMany,
        key: 'devices',
        relatedModel: 'Device',
        collectionType: 'DeviceCollection',
        reverseRelation: {
            key: 'belongsTo',
            includeInJSON: 'username'
        }
    }],
    initialize: function() {
        this.devices = new DeviceCollection();
    }
});

var UserCollection = Backbone.Collection.extend({
    model: UserModel,
    localStorage: new Backbone.LocalStorage("Users"),
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
                user.set("authToken", response.auth_token);
                return user;
            },
            loginFail = function () {
                console.log("Invalid login details");
            };

        return SparkApi.login({
            username: credentials.username,
            password: credentials.password
        }).pipe(loginDone, loginFail);
    }
});