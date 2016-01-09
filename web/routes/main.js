'use strict';

var Router = require('express').Router;


var indexHandler = module.exports.indexHandler = function(app) {
    return function handler(req, res, next) {
        app.get('counter', function (err, counter) {
            app.get('greeting', function (err, greeting) {
                res.render('index', {
                    count: counter.count(),
                    greeting: greeting.hello()
                });
            });
        });
    };
};

module.exports.register = function(app) {
    var router = Router();
    router.get('/', indexHandler(app));
    app.expressApp.use('/', router);
};
