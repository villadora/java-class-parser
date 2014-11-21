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


var typeRegex = '[a-zA-Z0-9\\.<>\\?\\$\\[\\]]+';


var classRegex = new RegExp('(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(class|interface) (' + typeRegex + ') (?:extends ((?:' + typeRegex +'),?)+ )?(?:implements ((?:[a-zA-Z0-9\\.<>\\?\\$])+,?)+ )?{([^}]+)}', 'gm');
//                             access modifier              return value             name
var methodRegex = new RegExp('(?:(public|private|protected) )?((?:static|abstract|final) ?)*(?:(' + typeRegex + ') )?([a-zA-Z]+)\\(([^\\)]*)\\)');


var fieldRegex = new RegExp('(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(' + typeRegex + ') ([a-zA-Z0-9]+)');

function outputParser(output) {
  var rs = {};
  var or = classRegex.exec(output);

  while(or) {
    var scope = or[1] || 'package';
    var describe = or[2];
    var type = or[3];
    var className = or[4];
    var exts = or[5];
    var impls = or[6];
    var classBody = or[7].split('\n').filter(Boolean).map(trimStr);
    var clz = {
      name: className,
      type: type,
      scope: scope,
      describe: (describe || '').trim(),
      'extends': exts ? exts.split(',').map(trimStr) : [],
      'implements': impls ? impls.split(',').map(trimStr) : [],
      constructors: [],
      fields: [],
      methods: []
    };

    classBody.forEach(function(member) {
      var signature = methodRegex.exec(member);
      if (!signature)  {
        signature = fieldRegex.exec(member);
        if (signature) {
          var scope = signature[1] || 'package';
          var describe = (signature[2] || '').trim();
          var type = signature[3];
          var name = signature[4];
          clz.fields.push({
            name: name,
            scope: scope,
            type: type,
            describe: describe
          });
        }

        return;
      }

      var scope = signature[1] || 'package';
      var describe = (signature[2] || '').trim();
      var retVal = signature[3];
      var name = signature[4];
      var args = signature[5];
      if (retVal == undefined) { // no ret, constructor
        var cons = {
          scope: scope,
          name: name,
          describe: describe,
          args: args ? args.split(',').map(trimStr) : []
        };

        clz.constructors.push(cons);
      }else {
        var m = {
          scope: scope,
          describe: describe,
          ret: retVal,
          name: name,
          args: args ? args.split(',').map(trimStr) : []
        };

        clz.methods.push(m);
      }
    });

    rs[className] = clz;

    or = classRegex.exec(output);
  }

  return rs;
}



function trimStr(str) {
  return str.trim();
}
