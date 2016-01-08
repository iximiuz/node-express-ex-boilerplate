'use strict';


function User(name) {
    this.name = name;
}

User.prototype.toJSON = function() {
    return {
        id: this.id,
        name: this.name
    }
};

module.exports = User;
