var app = {
    router: new Router()
};

var runTests = function () {
    module("Routes");

    test("Navigate to a user view", function () {
        var user = new UserModel();
        var loadDevicesSpy = sinon.stub(user, "loadDevices").returns(new $.Deferred().resolve(true));
        var renderSpy = sinon.stub(AppViews.UserView.prototype, "render");
        var changePageSpy = sinon.stub(app.router, "changePage");

        app.router.user(user);
        ok(loadDevicesSpy.calledOnce, "Load devices called");
        ok(renderSpy.calledOnce, "Render called");
        ok(changePageSpy.calledOnce, "Change page called");
        app.router.changePage.restore();
    });

    test("Navigate to a device view", function () {
        var user = new UserModel();
        user.devices.add({
            id: 123
        });

        app.collections = {
            users: {
                getCurrentUser: function () {}
            }
        };
        var getCurrentUserSpy = sinon.stub(app.collections.users, "getCurrentUser").returns(user);
        var setModelSpy = sinon.stub(AppViews.DeviceView.prototype, "setModel");
        var renderSpy = sinon.stub(AppViews.DeviceView.prototype, "render");
        var changePageSpy = sinon.stub(app.router, "changePage");

        app.router.device(123);
        ok(getCurrentUserSpy.calledOnce, "User fetched");
        ok(setModelSpy.calledOnce, "Device added");
        ok(renderSpy.calledOnce, "Render called");
        ok(changePageSpy.calledOnce, "Change page called");
        app.router.changePage.restore();
    });
};
