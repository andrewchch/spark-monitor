// Create a Backbone view
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
