var testView = {};

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
        var loginView = new AppViews.LoginView({id: "login", title: "Login", contentTemplate: "login-page-template"}),
            model = new LoginModel({
                username: "test user",
                password: "test password"
            }),
            container,
            userEl,
            passwordEl,
            inputUsername = "input username",
            inputPassword = "input password";

        testView = loginView;

        loginView.setModel(model);
        sinon.stub(app.router, "user");

        loginView.render();
        container = loginView.getContainer();
        userEl = $('[name = "username"]', container);
        passwordEl = $('[name = "password"]', container);

        ok(loginView.model, "View has a model");

        // Test initial bound values
        equal(userEl.length, 1, "View has username");
        equal(userEl.val(), model.get("username"), "Username has correct value");
        equal(passwordEl.length, 1, "View has password");
        equal(passwordEl.val(), model.get("password"), "Username has correct value");

        // Test updating bound model
        model.set("username", "new username");
        equal(userEl.val(), model.get("username"), "Username has been updated correctly");
        model.set("password", "new password");
        equal(passwordEl.val(), model.get("password"), "Password has been updated correctly");

        // Test dom element updating
        userEl.val(inputUsername).trigger('change');
        passwordEl.val(inputPassword).trigger('change');
        equal(model.get("username"), inputUsername, "Username has been updated from dom input");
        equal(model.get("password"), inputPassword, "Password has been updated from dom input");
    });
}
