/*jslint nomen: true */
requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.2.3/ramda.min',
    lambda: 'https://raw.githack.com/loop-recur/lambdajs/master/dist/lambda.amd',
    pointfree: 'https://raw.githack.com/DrBoolean/pointfree-fantasy/master/dist/pointfree.amd',
    bacon: 'https://cdnjs.cloudflare.com/ajax/libs/bacon.js/0.7.14/Bacon',
    future: 'http://looprecur.com/hostedjs/v2/data.future.umd',
    io: 'http://looprecur.com/hostedjs/v2/io',
    jquery: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min',
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
    'bacon',
    'io',
    'jquery',
    'domReady!'
  ],
  function (_, L, b, io, $) {

    var isPresent = compose(L.lt(0), _.get('length'), replace(/\s+/, '')),
      targetValue = compose(_.get('value'), _.get('target')),
      hasValue = compose(isPresent, targetValue),
      toggle = _.curry(function (el, bool) {
        el.disabled = !bool;
      }),
      toggleButton = toggle($('button'));


    var validityStream = compose(map(hasValue), listen('keyup')),
      prog = compose(map(toggleButton), validityStream);

    //////////////////////////////////////////////////////////////////////////////
    prog($('input')).onValue();
  });
