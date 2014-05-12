// API calls that we make outside a Model context

var SparkApi = (function() {
    // Privates
    var baseUrl = 'https://api.spark.io';

    var login = function(data) {
        return $.ajax({
            username: 'spark',
            password: 'spark',
            method: 'POST',
            url: baseUrl + '/oauth/token',
            data: {
                grant_type: 'password',
                username: data.username,
                password: data.password
            }
        });
    }

    return {
        login: login
    }

    //var request =
})();