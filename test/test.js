'use strict';

var path = require('path');
var assert = require('chai').assert;
var parser = require('../');

describe('test', function() {
  this.timeout(10000);
  it('test read Test.class', function(done) {
    parser([path.join(__dirname, './fixtures/Test.class')], function(err, rs) {
      if(err) return done(err);
      var test = rs['Test'];
      assert(test);

      assert.equal(test.name, 'Test');
      assert.equal(test.scope, 'public');
      assert.equal(test.type, 'class');
      assert.equal(test.extends.length, 0);
      assert.equal(test.implements.length, 0);

      assert.equal(test.fields.length, 2);
      var f1 = test.fields[0];
      assert.equal(f1.name, 'myInt');
      assert.equal(f1.scope, 'public');
      assert.equal(f1.type, 'int');
      assert.equal(f1.describe, 'static final');


      assert.equal(test.constructors.length, 1);
      var cons = test.constructors[0];
      assert.equal(cons.scope, 'public');
      assert.equal(cons.name, 'Test');
      assert.equal(cons.args.length, 1);

      assert.equal(test.methods.length, 1);
      var add = test.methods[0];
      assert.equal(add.scope, 'public');
      assert.equal(add.name, 'add');
      assert.equal(add.ret, 'int');
      assert.equal(add.args.length, 2);
      done();
    });
  });

  it('test innerClass Test$InnerClass.class', function(done) {
    parser([path.join(__dirname, './fixtures/Test$InnerClass.class')], function(err, rs) {
      var inner = rs['Test$InnerClass'];

      assert(inner);
      assert.equal(inner.name, 'Test$InnerClass');
      assert.equal(inner.scope, 'public');
      assert.equal(inner.type, 'class');
      assert.equal(inner.describe, 'final');
      done();
    });
  });

  it('test interfacae Interface.class', function(done) {
    parser([path.join(__dirname, './fixtures/Interface.class')], function(err, rs) {
      var iface = rs['fixtures.Interface'];

      assert(iface);
      assert.equal(iface.name, 'fixtures.Interface');
      assert.equal(iface.scope, 'public');
      assert.equal(iface.type, 'interface');
      assert.equal(iface.describe, '');
      assert.equal(iface.constructors.length, 0);

      assert.equal(iface.methods.length, 2);
      iface.methods.forEach(function(mt) {
        assert.equal(mt.scope, 'public');
        assert.equal(mt.describe, 'abstract');
      });

      assert.equal(iface.methods[0].ret, 'boolean');
      assert.equal(iface.methods[0].args.length, 0);

      assert.equal(iface.methods[1].name, 'getDataFromRemote');
      assert.equal(iface.methods[1].ret, 'java.lang.String');
      assert.equal(iface.methods[1].args[0], 'java.lang.String');

      done();
    });
  });


  it('test innerClass Test$InnerClass.class', function(done) {
    parser([path.join(__dirname, './fixtures/Test$InnerClass.class')], function(err, rs) {
      var inner = rs['Test$InnerClass'];

      assert(inner);
      assert.equal(inner.name, 'Test$InnerClass');
      assert.equal(inner.scope, 'public');
      assert.equal(inner.type, 'class');
      assert.equal(inner.describe, 'final');
      done();
    });
  });

  it('test enum EnumTest.class', function(done) {
    parser([path.join(__dirname, './fixtures/EnumTest.class')], function(err, rs) {
      var ennum = rs['EnumTest'];

      assert(ennum);
      assert.equal(ennum.name, 'EnumTest');
      assert.equal(ennum.scope, 'public');
      assert.equal(ennum.type, 'class');
      assert.equal(ennum.describe, 'final');
      assert.equal(ennum.extends.length, 1);
      assert.equal(ennum.extends[0], 'java.lang.Enum<EnumTest>');
      assert.equal(ennum.constructors.length, 0);

      assert.equal(ennum.fields.length, 3);
      ennum.fields.forEach(function(f) {
        assert.equal(f.scope, 'public');
        assert.equal(f.type, 'EnumTest');
        assert.equal(f.describe, 'static final');
      });


      assert.equal(ennum.methods.length, 2);
      assert.equal(ennum.methods[0].ret, 'EnumTest[]');
      
      done();
    });
  });


});
