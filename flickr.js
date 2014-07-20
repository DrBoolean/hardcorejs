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

 Future.prototype.concat = function(x) {
   return liftA2(concat, this, x);
 }
  /////////////////////////////////////////////////////////////////////////////////////
  // PictureBox

  //  PictureBox = data
  //    val :: Future([URL])
  var _PictureBox = function(val) {
    this.val = val;
    this.fork = this.val.fork;
  };

  var PictureBox = function(x){ return new _PictureBox(x); }

  // instance Monoid PictureBox where
  _PictureBox.prototype.empty = function () { return PictureBox(Future.of([])); };
  _PictureBox.prototype.concat = function (y) {
    return PictureBox(this.val.concat(y.val));
  };

  /////////////////////////////////////////////////////////////////////////////////////
  // Flickr api

  //  flickrFeed :: Future FlickrSearch
  var flickrFeed = getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&format=json&jsoncallback=?');

  //  imageUrls :: FlickrSearch -> [URL]
  var imageUrls = compose(_.pluck('m'), _.pluck('media'), _.get('items'));

  //  imageTag :: URL -> DOM
  var imageTag = function (url) { return $('<img />', { src: url }); };

  var makeImages = compose(map(imageTag), imageUrls);

  //  widget :: Future DOM
  var widget = PictureBox(map(makeImages, flickrFeed));


  /////////////////////////////////////////////////////////////////////////////////////
  // Test code

  mconcat([widget, widget]).fork(log, setHtml($('#flickr1')));
});

