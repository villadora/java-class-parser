'use strict';

var path = require('path');
var assert = require('chai').assert;
var parser = require('../');

describe('test', function() {
  it('test read', function(done) {
    parser([path.join(__dirname, './fixtures/Test.class')], function(err, rs) {
      if(err) return done(err);
      var test = rs['Test'];
      assert(test);
      assert.equal(test.name, 'Test');
      assert.equal(test.constructors.length, 1);
      assert.equal(test.methods.length, 1);
      var add = test.methods[0];
      console.log(add);
      done();
    });
  });
});
