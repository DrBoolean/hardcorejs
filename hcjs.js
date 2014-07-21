/*jslint nomen: true */
requirejs.config({
  shim: {
  },
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    lambda: 'https://raw.githack.com/loop-recur/lambdajs/master/dist/lambda.amd',
    pointfree: 'https://raw.githack.com/DrBoolean/pointfree-fantasy/master/dist/pointfree.amd',
    bacon: 'https://cdnjs.cloudflare.com/ajax/libs/bacon.js/0.7.14/Bacon',
    io: 'http://looprecur.com/hostedjs/v2/io',
    monoids: 'http://looprecur.com/hostedjs/v2/monoids',
    either: 'http://looprecur.com/hostedjs/v2/data.either.umd',
    string: 'http://looprecur.com/hostedjs/v2/string',
    fn: 'http://looprecur.com/hostedjs/v2/function',
    array: 'http://looprecur.com/hostedjs/v2/array'
  }
});

require([
  'ramda',
  'jquery',
  'lambda',
  'pointfree',
  'future',
  'bacon',
  'io',
  'domReady!'
],
function (_, $, L, pf, Future, b, io) {
  io.extendFn();
  L.expose(window);
  pf.expose(window);
  window.getJSON = function (url) {
    return new Future(function(rej, res){
      return $.getJSON(url,res);
    });
  }
  window.listen      = _.curry(function(name, el) { return b.fromEventTarget(el, name); });
  window.setHtml = _.curry(function($el, h){
    $el.html(h);
    return $el;
  });
  window.Tuple = _.curry(function(x, y) { return new _Tuple(x, y) });
  window.log         = function(x){ console.log(x); return x };

  var _empty = function() { return {}; };

  Object.defineProperty(Object.prototype, 'empty',{
      value: _empty,
      writable: true,
      configurable: true,
      enumerable: false
  });

  var _concat = function(y) {
    var that = this;
    Object.keys(y).reduce(function(acc, x) {
      if(acc[x]) {
        acc[x] = y[x].concat(acc[x]);
      } else {
        acc[x] = y[x];
      }
      return acc;
    }, that);
    return that;
  };

  Object.defineProperty(Object.prototype, 'concat',{
      value: _concat,
      writable: true,
      configurable: true,
      enumerable: false
  });

  var _Tuple = function(x, y) {
    this[0] = x;
    this[1] = y;
  }

  _Tuple.prototype.inspect = function() {
    return 'Tuple('+inspectIt(this[0])+' '+inspectIt(this[1])+')';
  }

  _Tuple.prototype.empty = function() { return Tuple(this[0].empty(), this[1].empty()) };

  _Tuple.prototype.concat = function(t2) {
    return Tuple(this[0].concat(t2[0]), this[1].concat(t2[1]))
  };

  Future.prototype.concat = function(x) {
    return liftA2(concat, this, x);
  }
});
