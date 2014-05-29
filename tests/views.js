var app = {};

module("Views", {
    setup: function() {
        app.router = new Backbone.Router();
    },
    tearDown: function() {
    }
});

test("Create a LoginView and render it", function () {
    app = {
        collections: {
            user: {
                getAuthorisedUser: function() {}
            }
        },
        router: new Backbone.Router(),
        user: function() {}
    };
    sinon.stub(app.router, "user");

    AppViews.loginView.render();

    ok(AppViews.loginView.model, "View has a model");
});
