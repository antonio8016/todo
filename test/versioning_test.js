
var request = require('request'),
    assert = require("assert"),
    versioning = require('../lib/versioning'),
    express = require('express'),
    app = require('../app'),
    uuid = require('node-uuid');

describe('api versioning', function() {

    describe('url versioning', function() {

        beforeEach(function() {
            app = require('../app');
            versioning(app);
        });

        afterEach(function() {
            // Removing the current routes (could be a hack...)
            delete app._router.map.get;
            app._router.map.get = [];
        });

        it('should work like the default route', function(done) {

            var contents = { key : uuid.v1() };

            // Setting up a route
            app.vget('/foo', function(req, res) {
                res.json(contents);
            });

            // Setting up a request to call it
            request('http://localhost:3000/foo', function (error, response, body) {
                assert.equal(body, JSON.stringify(contents));
                done();
            });

        });

        it('should accept single versioning', function(done) {

            var contents = { key : uuid.v1() };

            // Setting up a route
            app.vget({'path':'/foo', 'version':1}, function(req, res) {
                res.json(contents);
            });

            // Setting up a request to call it
            request('http://localhost:3000/v1/foo', function (error, response, body) {
                assert.equal(body, JSON.stringify(contents));
                done();
            });

        });

        it('shoud response to multiple versioning by setting them individually', function (done) {

            var contents1 = { key1 : uuid.v1() };
            var contents2 = { key2 : uuid.v1() };

            // Setting up multiple routes
            app.vget({'path':'/foo', 'version':1}, function(req, res) {
                res.json(contents1);
            });
            
            app.vget({'path':'/foo', 'version':2}, function(req, res) {
                res.json(contents2);
            });

            // Setting up a request to call it
            request('http://localhost:3000/v1/foo', function (error, response, body) {
                assert.equal(body, JSON.stringify(contents1));

                // Oracle
                request('http://localhost:3000/v2/foo', function (error, response, body) {
                    assert.equal(body, JSON.stringify(contents2));
                    done();
                });

            });

        });

        it('should respond to multiple versioning by setting them as an array', function (done) {

            var contents = { key1 : uuid.v1() };

            // Setting up multiple routes
            app.vget({'path':'/foo', 'versions':[1,2]}, function(req, res) {
                res.json(contents);
            });

            // Setting up a request to call it
            request('http://localhost:3000/v1/foo', function (error, response, body) {
                assert.equal(body, JSON.stringify(contents));

                // Oracle
                request('http://localhost:3000/v2/foo', function (error, response, body) {
                    assert.equal(body, JSON.stringify(contents));
                    done();
                });

            });

        });

        // it('shoud response to multiple versioning by setting them as a range', function (done) {

        //     // Setting up multiple routes
        //     app.vget({'path':'/foo', 'versions':'[1,5)'}, function(req, res) {
        //         res.json({});
        //     });

        //     // Setting up a request to call it
        //     request('http://localhost:3000/v1/foo', function (error, response, body) {
        //         console.log(body);

        //         // Oracle
        //         request('http://localhost:3000/v2/foo', function (error, response, body) {
        //             done();
        //         });

        //     });

        // });

        // it('should have multiple callbacks', function(done) {
        //     app.vget({path: '/foo', versions: '[1,5]'}, mw1, mw2, {1:cb1, 3:cb2});
        //     // app.vget('/foo', m1, m2, )
        //     // Options
        //     //    - location: path, headers. Default is path
        //     //    - prefix: any string. Default is 'v'
        //     //    - type: int, semver. Default is int

        // });

    });

    describe('request header versioning', function() {

    });

});

