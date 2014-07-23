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
function (_, $, L, pf, Future, b, io, Monoids) {
  io.extendFn();
  L.expose(window);
  pf.expose(window);
  var getJSON  = function (url) {
      return new Future(function(rej, res){
        return $.getJSON(url,res);
      });
    },
  listen      = _.curry(function(name, el) { return b.fromEventTarget(el, name); }),
  onValue      = _.curry(function(f, s) { return s.onValue(f); }),
  setHtml = _.curry(function($el, h){
    $el.html(h);
    return $el;
  }),
  log         = function(x){ console.log(x); return x };


  /////////////////////////////////////////////////////////////////////////////////////
  // Youtube api

  //  youtubeFeed :: Future YoutubeSearch
  var youtubeFeed = getJSON('http://gdata.youtube.com/feeds/api/videos?q=cats&alt=json');

  //  firstUrl :: [{url: String}] -> String
  var firstUrl = compose(_.get('url'), _.first);

  //  imageUrls :: YoutubeSearch -> [URL]
  var imageUrls = compose(map(firstUrl), _.pluck('media$thumbnail'), _.pluck('media$group'), _.get('entry'), _.get('feed'));

  //  imageTag :: URL -> DOM
  var imageTag = function (url) { return $('<img />', { src: url }); };

  var makeImages = compose(map(imageTag), imageUrls);

  //  widget :: Future DOM
  var widget = map(makeImages, youtubeFeed);


  /////////////////////////////////////////////////////////////////////////////////////
  // Test code

  widget.fork(log, setHtml($('#youtube')));
});

