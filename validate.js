/*jslint nomen: true */
requirejs.config({
  shim: {
  },
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.2.3/ramda.min',
    lambda: 'https://raw.githack.com/loop-recur/lambdajs/master/dist/lambda.amd',
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
  'lambda',
  'pointfree',
  'bacon',
  'io',
  'monoids',
  'domReady!'
],
function (_, L, pf, b, io, Monoids) {
  io.extendFn();
  L.expose(window);
  pf.expose(window);
  var runIO = io.runIO,
    IO      = io.IO,
    compose = _.compose,
    map     = _.map,
    getResult     = Monoids.getResult,
    listen  = _.curry(function(name, el) { return b.fromEventTarget(el, name); }),
    $       = function (sel) { return document.querySelector(sel); }
    All = Monoids.All;

  var isPresent    = compose(lt(0), _.get('length')),
    hasValue       = compose(isPresent, _.get('value')),
    log         = function(x){ console.log(x); return x }
    preventDefault = function(s){ return s.doAction('.preventDefault'); }

    var hasEmail = compose(All, hasValue, $, K('#email')),
        hasPassword = compose(All, hasValue, $, K('#password')),
        validate = compose(showValidations, getResult, mconcat([hasEmail, hasPassword])),
        submitIfValid = compose(map(validate), preventDefault, listen('submit')),
        prog = submitIfValid;

  //////////////////////////////////////////////////////////////////////////////

  prog($('form')).onValue(runIO);
});
