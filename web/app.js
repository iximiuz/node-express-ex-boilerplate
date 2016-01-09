'use strict';

var http = require('http');
var path = require('path');

var express = require('express');
var morgan = require('morgan');

var Application = require('../app');


function WebApp(options, services, routes) {
    Application.call(this, options, services);
    this._createExpressApp(routes);
}

WebApp.prototype = Object.create(Application.prototype);
WebApp.prototype.constructor = WebApp;

WebApp.prototype.startServer = function() {
    var port = normalizePort(this.options.http.port);
    this.expressApp.set('port', port);

    this.server = http.createServer(this.expressApp);
    this.server.listen(port);
    this.server.on('error', onError.bind(this));
    this.server.on('listening', onListening.bind(this));

    function bind() {
        return typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;
    }

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        // handle specific listen errors with friendly messages
        var bind = bind();
        switch (error.code) {
            case 'EACCES':
                this.logger.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;

            case 'EADDRINUSE':
                this.logger.error(bind + ' is already in use');
                process.exit(1);
                break;

            default:
                throw error;
        }
    }

    function onListening() {
        this.logger.info('Server started on [' + bind() + ']');
    }
};

WebApp.prototype._createExpressApp = function(routes) {
    var app = this.expressApp = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(morgan(this.options.morgan.format));
    app.use(express.static(path.join(__dirname, 'public')));

    var self = this;
    (routes || []).forEach(function(route) {
        route.register(self);
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler - no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
};

function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;   // named pipe
    }
    if (port >= 0) {
        return port;  // port number
    }
    return false;
}

module.exports = WebApp;
