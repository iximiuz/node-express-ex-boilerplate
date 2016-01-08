'use strict';

var Counter = require('./domain/services/Counter');
var Greeting = require('./domain/services/Greeting');
var UserRepo = require('./dao/UserRepo');

module.exports = [
    require('./dao/db'),
    {
        register: function(app) {
            app.set('repo.user', function(app, callback) {
                app.get('db', function(err, db) {
                    callback(err, db ? new UserRepo(db) : null)
                });
            });
        }
    },
    {
        register: function(app) {
            app.set('counter', function(app, callback) {
                callback(null, new Counter())
            });
        }
    },
    {
        register: function(app) {
            app.set('greeting', function(app, callback) {
                callback(null, new Greeting())
            }, {factory: true});
        }
    }
];
