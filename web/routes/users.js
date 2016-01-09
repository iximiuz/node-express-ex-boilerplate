'use strict';

var Router = require('express').Router;


var usersHandler = module.exports.usersHandler = function(app) {
    return function handler(req, res, next) {
        app.get('repo.user', function(err, userRepo) {
            userRepo.findAll(function(err, users) {
                res.render('users', {users: users});
            });
        });
    }
};

module.exports.register = function(app) {
    var router = Router();
    router.get('/', usersHandler(app));
    app.expressApp.use('/users', router);
};
