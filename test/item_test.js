var request = require('request')
  , item_seeds = require('./seeds/item_seeds')
  , assert = require("assert")

describe('/items resource', function(){
  
  beforeEach(function(done){
    item_seeds.setUp(done)
  })

  afterEach(function(done) {
    item_seeds.tearDown(done)
  })
  
  describe('GET /items', function(){
    
    it('should return all items', function(done){

      request('http://localhost:3000/items', function (error, response, body) {
      
        items = JSON.parse(body)
        var length = 0;
        for(var k in items) if(items.hasOwnProperty(k)) length++;
        assert.equal(length, 3)
        done()

      });

    })

  })

  describe('GET /items', function() {
    
    it('should find an item', function(done) {
      done()
    })

    it('should not find an item', function(done) {
      done()
    })

  })

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
        var item = JSON.parse(body)
        assert.equal(item.name, 'foo')
        done()
      })

    })

    it('should not add item and return as duplicated', function(done) {
      done()
    })

    it('should not add item and return as invalid body', function(done) {
      done()
    })

  })

})