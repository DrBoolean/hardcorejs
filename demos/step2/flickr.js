/*jslint nomen: true */
requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.2.3/ramda.min',
    future: 'http://looprecur.com/hostedjs/v2/data.future.umd',
    hcjs: 'http://looprecur.com/hostedjs/v2/hcjs'
  }
});

require([
  'ramda',
  'jquery',
  'future',
  'hcjs',
  'domReady!'
],
function (_, $, Future, hcjs) {

  //  imageTag :: URL -> DOM
  var imageTag = function (url) { return $('<img />', { src: url }); };

  /////////////////////////////////////////////////////////////////////////////////////
  // PictureBox

  //  PictureBox = data
  //    val :: Future(a)
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

  //  url :: String -> URL
  var url = function(t) {
    return 'http://api.flickr.com/services/feeds/photos_public.gne?tags='+t+'&format=json&jsoncallback=?';
  };

  //  src :: FlickrItem -> URL
  var src = compose(_.get('m'), _.get('media'));

  //  srcs :: FlickrSearch -> [URL]
  var srcs = compose(map(src), _.get('items'));

  //  images :: FlickrSearch -> [DOM]
  var images = compose(map(imageTag), srcs);

  //  widget :: String -> PictureBox
  var widget = compose(PictureBox, map(images), getJSON, url);


  /////////////////////////////////////////////////////////////////////////////////////
  // Test code

  mconcat([widget('cats'), widget('dogs')]).fork(log, setHtml($('#flickr')));
});

