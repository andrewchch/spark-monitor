var xhr,
    requests;

module("Spark API", {
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

test("Get an auth token", function () {

    var responseObj = {
        access_token: "254406f79c1999af65a7df4388971354f85cfee9",
        token_type: 'bearer',
        expires_in: 7776000
    };

    stop();

    var login = SparkApi.login({
        username: "andrew",
        password: "123"
    })

    login.done(function(response) {
        deepEqual(response, responseObj, "Valid response returned");
        start();
    });

    requests[0].respond(200, { "Content-Type": "application/json" }, JSON.stringify(responseObj));
});
