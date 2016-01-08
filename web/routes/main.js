'use strict';

var Router = require('express').Router;


module.exports.register = function(app) {
    var router = Router();
    router.get('/', function(req, res, next) {
        app.get('counter', function(err, counter) {
            app.get('greeting', function(err, greeting) {
                res.render('index', {
                    count: counter.count(),
                    greeting: greeting.hello()
                });
            });
        });
    });

    app.use('/', router);
};
