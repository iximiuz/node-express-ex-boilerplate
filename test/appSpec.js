'use strict';

var assert = require('chai').assert;
var Application = require('../app');


describe("Application Container Test Suite", function() {
    var app;
    beforeEach('create new app', function() {
        app = new Application();
    });

    it("should be called only once", function(done) {
        var called = 0;
        function serviceProvider(app, callback) {
            called++;
            callback(null, called);
        }

        app.set('service', serviceProvider);
        app.get('service', function(err, service) {
            assert.notOk(err);
            assert.equal(service, 1);
            assert.equal(called, 1);

            app.get('service', function(err, service) {
                assert.notOk(err);
                assert.equal(service, 1);
                assert.equal(called, 1);
                done();
            });
        });
    });

    it("should work with non-callable", function(done) {
        app.set('service', 42);
        app.get('service', function(err, value) {
            assert.notOk(err);
            assert.equal(value, 42);
            done();
        });
    });

    it("should protect callable", function(done) {
        var called = 0;
        function callable() {
            return called++;
        }

        app.set('service', callable, {protect: true});
        app.get('service', function(err, value) {
            assert.notOk(err);
            assert.strictEqual(value, callable);
            assert.equal(called, 0);
            done();
        });
    });

    it("should should be called each time", function(done) {
        var called = 0;
        function factory(app, callback) {
            called++;
            callback(null, called);
        }

        app.set('service', factory, {factory: true});
        app.get('service', function(err, value) {
            assert.notOk(err);
            assert.equal(value, 1);

            app.get('service', function(err, value) {
                assert.notOk(err);
                assert.equal(value, 2);
                done();
            });
        });
    });

    it('should throw because impossible to protect a factory', function() {
        assert.throws(
            function() {
                app.set('service', function() {}, {protect: true, factory: true});
            },
            'Cannot use "protect" and "factory" at the same time'
        );
    });

    it('should throw because no such service', function() {
        assert.throws(
            function() {
                app.get('foobar', function() {});
            },
            'Service [foobar] not found'
        );
    });
});