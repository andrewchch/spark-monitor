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
    idAttribute: "id",
    defaults:{
        email: "",
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
            includeInJSON: 'id'
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
    }
});