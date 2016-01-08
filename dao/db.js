'use strict';

var monk = require('monk');

module.exports.register = function(app) {
    app.set('db', function(app, callback) {
        callback(null, monk(app.options.mongo.dsn));
    });
};
