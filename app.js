'use strict';

var winston = require('winston');


/**
 * Base application constructor.
 *
 * @param options - application's config object.
 * @param services - array of services.
 * @constructor
 */
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

/**
 * Provides access to the specified service by async calling a callback(err, service).
 *
 * The service by itself could be:
 *  - service provider function (called only once at the first service access)
 *  - factory function (called each time a service is accessed)
 *  - any value (however, callable values require {protect: true} option to be passed)
 *
 * @param {String} name - name of the service.
 * @param {Function} callback - function(err, service)
 * @raise {Error} - in case of unknown service name.
 */
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

/**
 * Register a new service under the specified name.
 *
 * The service by itself could be:
 *  - service provider function (called only once at the first service access)
 *  - factory function (called each time a service is accessed)
 *  - any value (however, callable values require {protect: true} option to be passed).
 *
 * @param {String} name - name of the service.
 * @param provider - service provider function/factory function/any value.
 * @param {Object} options - {protected: {Boolean}, factory: {Boolean}}.
 *                            protected - if a service is just a function (not a service provider),
 *                                        protected must be true.
 *                            factory - if a service represented as a factory function (a function,
 *                                      that's called each time the service is accessed), factory
 *                                      must be true.
 */
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
