var startApp = function() {

    // Instantiate models
    app.collections = {
        alerts: new AlertCollection(),
        users: new UserCollection()
    };

    // Instantiate the route which will manage all view and navigation. Each view will instantiate any
    // models it needs.
    app.router = new Router();
};