var spawn = require('child_process').spawn;
var cmd = 'javap';


module.exports = function(files, options, cb) {
  files = files || [];
  if (typeof options == 'function') {
    cb = options;
    options = undefined;
  }

  options = options || {};

  if (options.args && (typeof options.outputParser != 'function')) {
    throw new Error('Please provide custom parser for ouput when providing new arguments');
  }

  var parse = options.outputParser || outputParser;

  files = files.filter(function(file) { return /\.class$/.test(file); });

  var output = '';
  var error = '';
  var child = spawn(cmd, (options.args ? options.args : ['-public']).concat(files));

  child.stdout.on('data', function (data) {
    output += '' + data;
  });

  child.stderr.on('data', function (data) {
    error += '' + data;
  });

  child.on('close', function (code) {
    if (code !== 0) {
      var err = new Error(error);
      err.code = code;
      return cb(err);
    }

    // success
    cb(null, parse(output));
  });

};



var classRegex = new RegExp('(?:a-z)* class ([a-zA-Z\\.<>\\?]+) {([^}]+)}', 'gm');
var methodRegex = new RegExp('(a-z)* ([a-zA-Z\\.<>\\?])+ ([a-zA-Z]+)\\(([^\\)]*)\\)');


function outputParser(output) {
  var rs = {};
  var or = classRegex.exec(output);

  while(or) {
    var className = or[1];
    var classBody = or[2].split('\n').filter(Boolean).map(function(str) { return str.trim(); });
    var clz = {
      name: className,
      constructors: [],
      methods: []
    };

    classBody.forEach(function(method) {
      var signature = methodRegex.exec(method);
      if (signature.length == 2) { // constructor
        var cons = {
          scope: signature[0]
        };

        var mc = methodRegex.exec(signature[1]);
        if (mc) {
          cons.name = mc[1];
          cons.args = mc[2] ? mc[2].split(',') : [];
        }
        
        clz.constructors.push(cons);
      }else {
        var m = {
          scope: signature[0],
          ret: signature[1]
        };
        var mc = methodRegex.exec(signature[2]);
        if (mc) {
          m.name = mc[1];
          m.args = mc[2] ? mc[2].split(',') : [];
        }
        clz.methods.push(m);
      }
    });

    rs[className] = clz;

    or = classRegex.exec(output);
  }

  return rs;
}
