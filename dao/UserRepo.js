'use strict';

var User = require('../domain/entities/User');


function UserRepo(db) {
    this._collection = db.get('users');
}

UserRepo.prototype.findAll = function(callback) {
    this._collection.find({}, function(err, users) {
        if (err) {
            return callback(err);
        }

        callback(null, users.map(function(data) {
            var user = new User(data.name);
            user.id = data._id;
            return user;
        }));
    });
};

UserRepo.prototype.save = function(user, callback) {
    var data = user.toJSON();
    data._id = data.id;
    delete data.id;

    if (data._id) {
        this._collection.updateById(data._id, data, callback);
    } else {
        this._collection.insert(data, callback);
    }
};

module.exports = UserRepo;
