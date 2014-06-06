var testView = {},
    xhr,
    requests;

var runTests = function () {
    var app = {};

    module("LoginView", {
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

        var loginView = new AppViews.LoginView({id: "login", title: "Login", contentTemplate: "login-page-template"}),
            model,
            container,
            userEl,
            passwordEl,
            inputUsername = "input username",
            inputPassword = "input password";

        testView = loginView;

        model = loginView.model
            .set("username", "test user")
            .set("password", "test password");

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

        // TODO: Test page submission?
    });

    module("UserView", {
        setup: function () {
            xhr = sinon.useFakeXMLHttpRequest();
            requests = [];

            xhr.onCreate = function (xhr) {
                requests.push(xhr);
            };
        },

        tearDown: function () {
            xhr.restore();
        }
    });

    test("Create a UserView and render it", function () {
        var userView = new AppViews.UserView({id: "user", title: "User", contentTemplate: "user-page-template"}),
            container = userView.getContainer(),
            model,
            devices = [
                {
                    id: "123",
                    name: "My Device"
                }],
            container,
            userEl,
            idEl;

        testView = userView;

        ok(userView.model, "View has a model");

        model = userView.model
            .set("id", 1)
            .set("username", "Test User");

        stop();
        model.loadDevices().done(function() {
            // Render the view and confirm
            userView.render();
            idEl = $('[name = "id"]', container);
            userEl = $('[name = "username"]', container);

            // Check that the devices list has been populated
            equal($(".devices", container).children().length, 1, "Devices list populated");
            start();
        }).fail(function() {
            console.log('failed');
        });

        requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify(devices));
    });
}
