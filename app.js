'use strict';

var winston = require('winston');


function Application(options, services) {
    this.options = options || {};
    this.logger = this.createLogger();
    this.services = {};

    var self = this;
    (services || []).forEach(function(service) {
        service.register(self);
    });
}

Application.prototype.init = function(callback) {
    // Here one can place async initialization code.
    callAsync(callback, null);
};

Application.prototype.get = function(name, callback) {
    var service = this.services[name];
    if (!service) {
        throw new Error('Service [' + name + '] not found');
    }

    if (service.factory) {
        callAsync(service.provider, this, callback);
    } else if (service.hasOwnProperty('value')) {
        callAsync(callback, null, service.value);
    } else {
        service.provider(this, function(err, value) {
            if (!err) {
                service.value = value;
            }
            callback(err, value);
        });
    }
};

Application.prototype.set = function(name, provider, options) {
    options = options || {};
    if (options.factory && options.protect) {
        throw new Error(
            'Cannot use "protect" and "factory" at the same time'
        );
    }

    var isFunc = (typeof provider === 'function');
    var service = {factory: !!options.factory};
    if (!isFunc) {
        if (options.factory || options.protect) {
            throw new Error('Provider must be callable');
        }
        service.value = provider;
    } else if (options.protect) {
        service.value = provider;
    } else {
        service.provider = provider;
    }

    this.services[name] = service;
};

Application.prototype.createLogger = function() {
    var options = this.options.logging;
    if (!options) {
        return winston;  // winston default logger
    }
    var transports = Object.keys(options).map(function(name) {
        var opt = options[name];
        opt.name = name;
        return new winston.transports[opt.transport](opt);
    });
    return new winston.Logger({transports: transports});
};

function callAsync() {
    var callback = arguments[0];
    var args = [].slice.call(arguments, 1);
    setTimeout(function() {
        callback.apply(null, args);
    }, 0)
}

module.exports = Application;
