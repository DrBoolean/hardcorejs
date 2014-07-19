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


  //  imageTag :: URL -> DOM
  var imageTag = function (url) { return $('<img />', { src: url }); };

  /////////////////////////////////////////////////////////////////////////////////////
  // Flickr api

  //  flickrFeed :: Future FlickrSearch
  var flickrFeed = getJSON('http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?');

  //  imageUrls :: FlickrSearch -> [URL]
  var imageUrls = compose(_.pluck('m'), _.pluck('media'), _.get('items'));

  //  tags :: FlickrSearch -> Map String Int
  var tags = compose(_.countBy(_.identity), _.reject(_.isEmpty), _.flatten, _.map(split(' ')), _.pluck('tags'), _.get('items'));


  /////////////////////////////////////////////////////////////////////////////////////
  // PictureBox

  //  PictureBox = data
  //    images :: [URL]
  //    tags   :: Map String Int
  var PictureBox = function(imgs, ts) {
    this.images = imgs;
    this.tags   = ts;
  };

  // instance Monoid PictureBox where
  PictureBox.prototype.empty = function () { return new PictureBox([], {}); };
  PictureBox.prototype.concat = function (y) {
    return new PictureBox(
      this.images.concat(y.images),
      this.tags // TODO: properly add tag counts with y.tags
    );
  };

  //  renderPictureBox :: PictureBox -> IO DOM
  var renderPictureBox = function (pb) {
    return $('<div></div>', {'class': 'flickr'}).append(
      _.map( imageTag, pb.images )
    );
  }.toIO();

  /////////////////////////////////////////////////////////////////////////////////////
  // Test code

  flickrFeed.fork(log, function (t) {
    var pb = new PictureBox(imageUrls(t), tags(t));
    var r = renderPictureBox(
      pb.concat(pb)
    ).runIO();
    $('#flickr1').append(r);
  });

});

