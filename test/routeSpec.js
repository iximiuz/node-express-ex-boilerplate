'use strict';

var assert = require('chai').assert;
var Application = require('../app');
var User = require('../domain/entities/User');
var usersRoute = require('../web/routes/users');

describe("Users Route Test Suite", function() {
    var app;
    beforeEach('create new app', function() {
        app = new Application();
        app.set('repo.user', function userRepoProvider(app, callback) {
            callback(null, {
                findAll: function(callback) {
                    callback(null, [new User('John'), new User('Mary')]);
                }
            });
        });
    });

    it("should return users list", function(done) {
        var handler = usersRoute.usersHandler(app);
        var req = {};
        var res = {
            render: function(view, params) {
                assert.equal(view, 'users');
                assert.isArray(params.users);
                assert.equal(params.users.length, 2);
                assert.equal(params.users[0].name, 'John');
                assert.equal(params.users[1].name, 'Mary');
                done();
            }
        };
        var next = function() {};
        handler(req, res, next);
    });
});