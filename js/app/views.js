// Create a Backbone view
var BaseView = Backbone.View.extend({
    //local variable for model binder
    _modelBinder: undefined,
    initialize: function () {
        //on view initialize, initialize _modelBinder
        this._modelBinder = new Backbone.ModelBinder();
    },
    close: function () {
        //when view closes, unbind Model bindings
        this._modelBinder.unbind();
    },
    render: function () {
        //when the view is rendered
        //get the templates id from passed in options
        //NOTE: templateId is not a property of Backbone or       ModelBinder, its a custom parameter that we pass into view's constructor

        var templateId = "#" + this.options.templateId;

        //construct the template
        var template = _.template($(templateId).html());
        var templateHTML = template();
        //append it to current view
        this.el.html(templateHTML);

        //get the bindings attribute from passed options
        //NOTE: bindings is not a property of Backbone, its a custom parameter that we pass into view's constructor
        var bindings = this.options.bindings;

        //call modelBinder bind api to apply bindings on the current view
        this._modelBinder.bind(
            this.model /*the model to bind*/ ,
            this.el /*root element*/ ,
            bindings /*bindings*/
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

// Specific page views
var 

