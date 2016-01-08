'use strict';

function Counter() {
    this.counter = 0;
    this.dt = new Date();
}

Counter.prototype.count = function() {
    return this.counter++ + ' (I was born at ' + this.dt + ')';
};

module.exports = Counter;
