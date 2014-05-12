// Create a Backbone view
var PageView = Backbone.View.extend({
    //local variable for model binder
    _modelBinder: undefined,
    _model: undefined,
    _container: undefined,
    _bindings: undefined,
    initialize: function () {
        //on view initialize, initialize _modelBinder
        this._modelBinder = new Backbone.ModelBinder();
        this._model = this.options.model;
        this._container = this.options.container;
        this._bindings = this.options.bindings;
    },
    close: function () {
        //when view closes, unbind Model bindings
        this._modelBinder.unbind();
    },
    render: function () {
        //when the view is rendered
        //get the container from passed in options
        this.$el = this._container;

        //call modelBinder bind api to apply bindings on the current view
        this._modelBinder.bind(
            this._model /*the model to bind*/ ,
            this.el /*root element*/ ,
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
    initialize: function () {
        this._itemHtml = $("#" + this.options.itemTemplateId);
        this._collection = this.options.collection;
        this._collectionContainer = this.options.collectionContainer;
        this._bindings = this.options.bindings;
        var elManagerFactory = new Backbone.CollectionBinder.ElManagerFactory(this._collectionContainer, this._itemHtml, "data-name");
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
