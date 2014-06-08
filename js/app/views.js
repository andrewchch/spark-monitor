var AppViews = (function()
{
    var buildPage = function(params) {
        var pageEl = $("#"  + params.id);

        if (pageEl.length === 0) {
            var pageTemplate = Utils.getPageTemplate(),
                html = pageTemplate(params);

            pageEl = $(html).appendTo($("body"));
        }
        return pageEl;
    };

    var PageView = Backbone.View.extend({
        //local variable for model binder
        _modelBinder: undefined,
        _model: undefined,
        _container: undefined,
        _bindings: undefined,
        initialize: function (options) {
            this.id = this.id || options.id;
            this.title = this.title || options.title;
            this._model = this.model || options.model;
            this._bindings = this.bindings || options.bindings;
            this.on_submit = this.on_submit || options.on_submit;
            this.afterRender = this.afterRender || options.afterRender;
            this.contentTemplate = this.contentTemplate || options.contentTemplate;

            this._modelBinder = new Backbone.ModelBinder();
        },
        getContainer: function() {
            return this._container;
        },
        getModel: function() {
            return this._model;
        },
        setModel: function (model) {
            this._model = model;
            return this._model;
        },
        close: function () {
            //when view closes, unbind Model bindings
            this._modelBinder.unbind();
        },
        render: function () {
            // Build the page content
            var content = _.template($("#" + this.contentTemplate).html())();
            this.$el = this._container = buildPage({
                id: this.id,
                title: this.title,
                content: content
            });

            this.delegateEvents();

            //call modelBinder bind api to apply bindings on the current view
            this._modelBinder.bind(
                this._model,
                this.$el,
                this._bindings
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
            var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(this._itemHtml, this._bindings);
            this._collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
        },
        render: function(){
            this._collectionBinder.bind(this._collection, this._collectionContainer);
            return this;
        },
        close: function(){
            this._collectionBinder.unbind();
        }
    });

    var LoginView = PageView.extend({
        model: new LoginModel(),
        container: null,
        bindings: {
            "username": '[name = "username"]',
            "password": '[name = "password"]'
        },
        initialize: function(options) {
            this.container = options.container;
            PageView.prototype.initialize.call(this, options);
        },
        on_submit: function () {
            //PubSub.publish("loading");
            app.collections.users.getAuthorisedUser({
                username: this._model.get("username"),
                password: this._model.get("password")
            }).done(function(user) {
                // We have an authorised user so go to the user page
                app.router.user(user);
            }).fail(function() {
                // Display the error
                console.log("on_submit: Invalid login details");
            }).always(function() {
                //PubSub.publish("stoppedLoading");
            });
        }
    });

    // Page Views
    var UserView = PageView.extend({
        model: new UserModel(),
        container: $("#user"),
        deviceListView: null,
        bindings: {
            "id": '[name = "id"]',
            "name": '[name = "username"]'
            // TODO: list devices
        },
        initialize: function(options) {
            this.container = options.container;
            PageView.prototype.initialize.call(this, options);
        },
        afterRender: function() {
            // Add the devices view
            this.deviceListView = new ListView({
                collectionContainer: $(".devices", this.getContainer()),
                itemTemplateId: "deviceListItemTemplate",
                collection: this.model.devices,
                bindings: {
                    name: '[name="name"]',
                    id: {
                        selector: '[name="name"]',
                        elAttribute: 'href',
                        converter: function(direction, value, modelAttributeName, model, boundEl) {
                            return model.getUrl();
                        }
                    }
                }
            });

            this.deviceListView.render();
        }
    });

    var DeviceView = PageView.extend({
        model: new DeviceModel(),
        container: $("#device"),
        bindings: {
            "id": '[name = "id"]',
            "name": '[name = "name"]'
            // TODO: list variables and functions
        },
        initialize: function(options) {
            this.container = options.container;
            PageView.prototype.initialize.call(this, options);
        }
    });

    var AlertView = PageView.extend({
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
        },
        initialize: function(options) {
            this.container = options.container;
            PageView.prototype.initialize.call(this, options);
        }
    });

    return {
        LoginView: LoginView,
        UserView: UserView,
        DeviceView: DeviceView,
        AlertView: AlertView
    }
})();
