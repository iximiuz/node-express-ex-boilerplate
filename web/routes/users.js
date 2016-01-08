'use strict';

var Router = require('express').Router;


module.exports.register = function(app) {
    var router = Router();
    router.get('/', function(req, res, next) {
        app.get('repo.user', function(err, userRepo) {
            userRepo.findAll(function(err, users) {
                res.render('users', {users: users});
            });
        });
    });

    app.use('/users', router);
};
