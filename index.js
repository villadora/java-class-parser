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
var methodRegex = new RegExp('([a-zA-Z]+) (?:([a-zA-Z\\.<>\\?]+) )?([a-zA-Z]+)\\(([^\\)]*)\\)');


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
      if (signature[2] == undefined) { // no ret, constructor
        var cons = {
          scope: signature[1]
        };

        cons.name = signature[3];
        cons.args = signature[4] ? signature[4].split(',') : []; 
        
        clz.constructors.push(cons);
      }else {
        var m = {
          scope: signature[1],
          ret: signature[2]
        };

        m.name = signature[3];
        m.args = signature[4] ? signature[3].split(',') : [];
        clz.methods.push(m);
      }
    });

    rs[className] = clz;

    or = classRegex.exec(output);
  }

  return rs;
}
