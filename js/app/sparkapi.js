// API calls that we make outside a Model context

var SparkApi = (function() {
    // Privates
    var baseUrl = 'https://api.spark.io',
        basicAuth = "Basic " + btoa("spark:spark");

    $.ajaxPrefilter(function(options) {
        options.url = baseUrl + options.url;
    });

    var login = function(data) {
        return $.ajax({
            type: 'POST',
            headers: {
                "Authorization": basicAuth
            },
            url: '/oauth/token',
            data: {
                grant_type: 'password',
                username: data.username,
                password: data.password
            }
        });
    }

    return {
        login: login
    };

    //var request =
})();