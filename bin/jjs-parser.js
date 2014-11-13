#!/usr/bin/env node

var parser = require('../');


var args = process.argv.slice(2);

parser(args, function(err, rs) {
  if (err) 
    return console.error(err.message);

  for(var clzName in rs) {
    var clz = rs[clzName];
    console.log(clzName + ':');
    console.log('\tconstructor: %s %s(%s)', clz.cons.scope, clz.cons.name, clz.cons.args.join(','));
    console.log('\tmethods:');
    clz.methods.forEach(function(method) {
      console.log('\t\t%s %s %s(%s)', method.scope, method.ret, method.name, method.args.join(','));
    });
    console.log();
  }
});




