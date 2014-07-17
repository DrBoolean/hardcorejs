/*jslint nomen: true */
requirejs.config({
  shim: {
  },
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
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
  'jquery',
  'lambda',
  'pointfree',
  'future',
  'bacon',
  'io',
  'monoids',
  'domReady!'
],
function (_, jQuery, L, pf, Future, b, io, Monoids) {
  io.extendFn();
  L.expose(window);
  pf.expose(window);
  var runIO = io.runIO,
    $       = function (sel) { return document.querySelector(sel); },
    getJSON  = function (url) {
      return new Future(function(rej, res){
        return jQuery.getJSON(url,res);
      });
    },
    setHtml = _.curry(function(sel, h){ return jQuery(sel).html(h); }).toIO(),
    log         = function(x){ console.log(x); return x };


    var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?',
        makeImage = function(i){ return jQuery('<img />', {src: i.media.m}); }
        putOnScreen = compose(setHtml('#main'), map(makeImage), _.get('items'))
        prog = compose(map(putOnScreen), getJSON);

  //////////////////////////////////////////////////////////////////////////////

  prog(flickrURL).fork(log, runIO);
});
