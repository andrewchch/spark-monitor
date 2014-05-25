var app = {},
    views;

module("Views", {
    setUp: function() {
        app.router = new Backbone.Router();
        views = AppViews();
    },
    tearDown: function() {
    }
});

test("Create a LoginView and render it", function () {
    sinon.stub(app.router, "user");

    views.loginView.render();

    ok(loginView.model, "View has a model");
});
