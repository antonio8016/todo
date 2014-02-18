process.env.NODE_ENV = 'test';

var request = require('request')
  , item_seeds = require('./seeds/item')
  , assert = require("assert")
  , app = require('../app')

describe('/items resource', function() {
  
    beforeEach(function(done){
        item_seeds.setUp(done)
    });

    afterEach(function(done) {
        item_seeds.tearDown(done)
    });
  
    describe('GET /items', function() {
    
        it('should return all items', function(done){

            request('http://localhost:3000/items', function (error, response, body) {
      
                items = JSON.parse(body);
                var length = 0;
                for(var k in items) if(items.hasOwnProperty(k)) length++;
                assert.equal(length, 3);
                done();

            });

        });

    });

    describe('GET /items/:id', function() {
    
        it('should find an item', function(done) {

            // Get all the items
            request('http://localhost:3000/items', function (error, response, body) {
                items = JSON.parse(body);
                var length = 0;
                for(var k in items) if(items.hasOwnProperty(k)) length++;
                assert.equal(length, 3);
                var item1 = items[0];
                request('http://localhost:3000/items/' + item1.id, function (error, response, body) {
                    var item2 = JSON.parse(body);
                    assert.equal(item1.name, item2.name);
                    done();
                });
            });
        });

        it('should not find an item', function(done) {
      
            request('http://localhost:3000/items/52fc1001364141ce798012d2', function (error, response, body) {
                assert.equal(404, response.statusCode);
                done();
            });
        });
    });

    describe('POST /items', function() {

        it('should add an item', function(done) {

            // Setup request options
            var options = {
                url: 'http://localhost:3000/items',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{"name" : "foo"}'
            };

            // Perform the request
            request.post(options, function (error, response, body) {
                var item = JSON.parse(body);
                assert.equal(item.name, 'foo');
                done();
            });
        });

        it('should not add item and return as duplicated', function(done) {
      
            // Setup request options
            var options = {
                url: 'http://localhost:3000/items',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: '{"name" : "Do groceries"}'
            };

            // Perform the request
            request.post(options, function (error, response, body) {
                assert.equal(409, response.statusCode);
                done();
            });
        });

        it('should not add item and return as invalid body', function(done) {
            done();
        });

    });

    describe('PUT /items/:id', function() {

        it('should modify the an item', function(done) {

            // Get an item to modify
            request('http://localhost:3000/items', function (error, response, body) {
                items = JSON.parse(body);
                var length = 0;
                for(var k in items) if(items.hasOwnProperty(k)) length++;
                assert.equal(length, 3);
                var item1 = items[0];

                // Assigning a new value
                var options = {
                    url: 'http://localhost:3000/items/' + item1.id,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: '{"name" : "Do groceries, NOT!!"}'
                };

                request.put(options, function (error, response, body) {
                    var item2 = JSON.parse(body);
                    assert.equal(200, response.statusCode);
                    assert.equal(item2.name, item2.name);
                    done();
                });

            });

        });

        it('should not modify an item because the proposed change actually doesn\'t change anything', function(done) {
             // Get an item to modify
            request('http://localhost:3000/items', function (error, response, body) {
                items = JSON.parse(body)
                var length = 0;
                for(var k in items) if(items.hasOwnProperty(k)) length++;
                assert.equal(length, 3);
                var item1 = items[0];

                // Assigning a new value
                var options = {
                    url: 'http://localhost:3000/items/' + item1.id,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: '{"name" : "Do groceries"}'
                };

                // Trying to modify a resource
                request.put(options, function (error, response, body) {
                    assert.equal(304, response.statusCode);
                    done();
                });
            });
        });  
    });

    describe('DELETE /items/:id', function() {
    
        it('should delete an item', function(done) {

            // Get all the items
            request('http://localhost:3000/items', function (error, response, body) {      
        
                var before = JSON.parse(body);
                var before_count = 0;
                for(var k in before) if(before.hasOwnProperty(k)) before_count++;
                var item = before[0];
        
                request.del('http://localhost:3000/items/' + item.id, function (error, response, body) {  
          
                    request('http://localhost:3000/items/', function (error, response, body) {

                        var after = JSON.parse(body);
                        var after_count = 0;
                        for(var k in after) if(after.hasOwnProperty(k)) after_count++;
                        assert.equal(before_count, after_count + 1);
                        done();

                    });

                });

            });

        });

        it('should not find the item to delete', function(done) {

            request.del('http://localhost:3000/items/52fc1001364141ce798012d2', function(error, response, body) {
                assert.equal(400, response.statusCode);
                done();
            });

        });

    });

})