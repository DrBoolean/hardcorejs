/*jslint nomen: true */
requirejs.config({
  shim: {
  },
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    ramda: 'https://raw.githack.com/CrossEye/ramda/master/ramda',
    pointfree: 'https://raw.githack.com/DrBoolean/pointfree-fantasy/master/dist/pointfree.amd',
    bacon: 'https://cdnjs.cloudflare.com/ajax/libs/bacon.js/0.7.14/Bacon',
    future: 'http://looprecur.com/hostedjs/v2/data.future.umd',
    io: 'http://looprecur.com/hostedjs/v2/io',
    maybe: 'http://looprecur.com/hostedjs/v2/maybe',
    id: 'http://looprecur.com/hostedjs/v2/id',
    monoids: 'http://looprecur.com/hostedjs/v2/monoids',
    either: 'http://looprecur.com/hostedjs/v2/data.either.umd',
    string: 'http://looprecur.com/hostedjs/v2/string',
    fn: 'http://looprecur.com/hostedjs/v2/function',
    array: 'http://looprecur.com/hostedjs/v2/array'
  }
});

require([
  'ramda',
  'pointfree',
  'bacon',
  'future',
  'io',
  'maybe',
  'id',
  'monoids',
  'either',
  'domReady!'
],
function (_, pf, b, Future, io, Maybe, Id, Monoids, Either) {
  io.extendFn();
  var runIO = io.runIO,
  IO        = io.IO,
  Left      = Either.Left,
  Right     = Either.Right,
  compose   = _.compose,
  map       = _.map,
  log       = _.curry(function(x) { console.log(x); return x; }),
  onValue   = _.curry(function(f, obj){ return obj.onValue(f); }),
  listen    = _.curry(function(name, el) { return b.fromEventTarget(el, name); }),
  lt        = _.curry(function(a, b){ return a < b; });

  var getElement = function (sel) {
    return document.querySelector(sel);
  }.toIO();

  var input = getElement('input'),
    button = getElement('button').runIO();

  var isPresent    = compose(lt(0), _.get('length')),
    targetValue    = compose(_.get('value'), _.get('target')),
    hasValue       = compose(isPresent, targetValue),
    validityStream = compose(map(hasValue), listen('keyup')),
    toggle = _.curry(function(el, bool){
      el.disabled = !bool;
      return el;
    });

  var prog = compose(map(map(toggle(button))), map(validityStream), getElement);

  prog('input').runIO().onValue();
});
