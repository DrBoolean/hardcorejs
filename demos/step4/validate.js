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
    'monoids',
    'domReady!'
  ],
  function (_, L, pf, b, Monoids) {
    L.expose(window);
    pf.expose(window);
    var compose = _.compose,
      map = _.map,
      getResult = Monoids.getResult,
      listen = _.curry(function (name, el) {
        return b.fromEventTarget(el, name);
      }),
      $ = function (sel) {
        return document.querySelector(sel);
      },
      setHtml = _.curry(function (sel, h) {
        $(sel).innerHTML = h;
      }),
      log = function (x) {
        console.log(x);
        return x
      },
      All = Monoids.All;

    var isPresent = compose(All, lt(0), _.get('length'), replace(/\s+/, '')),
      isEmail = compose(All, test(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)),
      isLongEnough = compose(All, lt(7), _.get('length')),
      targetValue = compose(_.get('value'), _.get('target')),
      preventDefault = function (s) {
        return s.doAction('.preventDefault');
      };

    var validate = compose(getResult, mconcat([isEmail, isLongEnough, isPresent])),
      emailChanges = compose(map(targetValue), listen('keyup')),
      prog = compose(map(validate), emailChanges);

    //////////////////////////////////////////////////////////////////////////////

    prog($('#email')).onValue(setHtml('#is-valid'));
  });