var Utils = (function() {
    var loadTemplates = function (path) {
        path = path || "templates.html";
        return $.get(path)
        .pipe(function(responseText) {
            return $("#templates").html(responseText);
        });
    };

    var getPageTemplate = function () {
        return _.template($("#page-template").html());
    };

    return {
        loadTemplates: loadTemplates,
        getPageTemplate: getPageTemplate
    }
})();