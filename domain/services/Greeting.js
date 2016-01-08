'use strict';

function Greeting() {
    this.dt = new Date();
}

Greeting.prototype.hello = function() {
    return 'Hello! (I was born at ' + this.dt + ')';
};

module.exports = Greeting;
