var AppViews = (function()
{
    var PageView = Backbone.View.extend({
        //local variable for model binder
        _modelBinder: undefined,
        _model: undefined,
        _container: undefined,
        _bindings: undefined,
        initialize: function (options) {
            //on view initialize, initialize _modelBinder
            this._modelBinder = new Backbone.ModelBinder();
            this._model = options.model;
            this.$el = this._container = options.container;
            this._bindings = options.bindings;
            this.on_submit = options.on_submit;
            this.afterRender = options.afterRender;

            this.delegateEvents();
        },
        close: function () {
            //when view closes, unbind Model bindings
            this._modelBinder.unbind();
        },
        render: function () {
            //call modelBinder bind api to apply bindings on the current view
            this._modelBinder.bind(
                this._model /*the model to bind*/ ,
                this.$el /*root element*/ ,
                this._bindings /*bindings*/
            );

            if (this.afterRender) {
                this.afterRender();
            }

            return this;
        },
        events: {
            'click input[type=submit]': 'on_submit'
        }
    });

    var ListView = Backbone.View.extend({
        //local variable for collection binder
        _collectionBinder: undefined,
        _itemHtml: undefined,
        _collection: undefined,
        _collectionContainer: undefined,
        _bindings: undefined,
        initialize: function (options) {
            this._itemHtml = $("#" + options.itemTemplateId).html();
            this._collection = options.collection;
            this._collectionContainer = options.collectionContainer;
            this._bindings = options.bindings;
            var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(this._itemHtml, "data-name");
            this._collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
        },
        render: function(){
            this._collectionBinder.bind(this._collection, this._collectionContainer, this._bindings);
            return this;
        },
        close: function(){
            this._collectionBinder.unbind();
        }
    });

    var loginView = new PageView({
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
                app.router.user();
            }).fail(function() {
                // Display the error
                console.log("on_submit: Invalid login details");
            }).always(function() {
                PubSub.publish("stoppedLoading");
            });
        }
    });

    // Page Views
    var userView = new PageView({
        model: new UserModel(),
        container: $("#user"),
        deviceListView: null,
        bindings: {
            "id": '[name = "id"]',
            "name": '[name = "name"]'
            // TODO: list devices
        },
        afterRender: function() {
            // Add the devices view
            this.deviceListView = new ListView({
                collectionContainer: $(".devices", this.container),
                itemTemplateId: "deviceListItemTemplate",
                collection: this.model.devices,
                bindings: {
                    name: '[name="name"]',
                    id: {selector: '[name="name"]', elAttribute: 'href', converter: function() { return this.model.getUrl(); } }
                }
            });
        }
    });

    var deviceView = new PageView({
        model: new DeviceModel(),
        container: $("#device"),
        bindings: {
            "id": '[name = "id"]',
            "name": '[name = "name"]'
            // TODO: list variables and functions
        }
    });

    var alertView = new PageView({
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

    return {
        loginView: loginView,
        userView: userView,
        deviceView: deviceView,
        alertView: alertView
    }
})();
