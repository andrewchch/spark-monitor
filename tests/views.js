var runTests = function () {
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
            router: {
                user: function () {}
            }
        };
        // Create a dom container
        var loginView = new AppViews.LoginView({id: "login", title: "Login", contentTemplate: "login-page-template"});
        sinon.stub(app.router, "user");

        loginView.render();

        ok(loginView.model, "View has a model");
    });
}
