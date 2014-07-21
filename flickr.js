/*jslint nomen: true */
requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.2.3/ramda.min',
    future: 'http://looprecur.com/hostedjs/v2/data.future.umd',
    maybe: 'http://looprecur.com/hostedjs/v2/maybe',
    id: 'http://looprecur.com/hostedjs/v2/id',
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


  //  imageTag :: URL -> DOM
  var imageTag = function (url) { return $('<img />', { src: url }); };

  /////////////////////////////////////////////////////////////////////////////////////
  // Flickr api

  //  flickrFeed :: Future FlickrSearch
  var flickrFeed = getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&format=json&jsoncallback=?');

  //  imageUrls :: FlickrSearch -> [URL]
  var imageUrls = compose(_.pluck('m'), _.pluck('media'), _.get('items'));

  //  images :: FlickrSearch -> [DOM]
  var images = compose(map(imageTag), imageUrls);

  //  widget :: PictureBox
  var widget = PictureBox(map(makeImages, flickrFeed));


  /////////////////////////////////////////////////////////////////////////////////////
  // Youtube api

  //  youtubeFeed :: Future YoutubeSearch
  var youtubeFeed = getJSON('http://gdata.youtube.com/feeds/api/videos?q=cats&alt=json');

  //  firstUrl :: [{url: String}] -> String
  var firstUrl = compose(_.get('url'), _.first);

  //  imageUrls :: YoutubeSearch -> [URL]
  var imageUrls = compose(map(firstUrl), _.pluck('media$thumbnail'), _.pluck('media$group'), _.get('entry'), _.get('feed'));

  //  images :: YoutubeSearch -> [DOM]
  var images = compose(map(imageTag), imageUrls);

  //  youtube_widget :: PictureBox
  var youtube_widget = PictureBox(map(makeImages, youtubeFeed));

  /////////////////////////////////////////////////////////////////////////////////////
  // Test code

  mconcat([youtube_widget, widget]).fork(log, setHtml($('#flickr')));
});

