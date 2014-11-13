# Java Class Parser [![NPM version](https://badge.fury.io/js/java-class-parser.svg)](http://badge.fury.io/js/java-class-parser) [![Build Status](https://travis-ci.org/villadora/java-class-parser.svg?branch=master)](https://travis-ci.org/villadora/java-class-parser)

A simple lib wrapped `javap` to parse java .class files into json format

## Install

```bash
$ npm install java-class-parser --save [-g]
```

## Usage

In command line:

```bash
$ jjs-parser ./Model.class Service.class
```


In node:

```js
var parser = require('java-class-parser');

var clazzes = ['./Config.class'];

parser.parse(clazzes, function(err, rs) {
    for (var clzName in rs) {
        var clz = rs[clzName];
        clz.cons; // constructor, includes property scope, name, args
        clz.methods; // an array of methods;
        clz.methods[0]; // method, includes property scope, ret, name, args
    }
});

```

## API

### parser(clazzesPaths, [options], callback);

* clazzesPaths *Array* Paths of classes
* options *Object* current only =args= and =outputParser= is available
* callback *function*

## Licence

MIT

