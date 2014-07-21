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
  _PictureBox.prototype.empty = function () { return PictureBox(Future.of(Tuple)); };
  _PictureBox.prototype.concat = function (y) {
    return PictureBox(this.val.concat(y.val));
  };

  //  imageTag :: URL -> DOM
  var imageTag = function (url) { return $('<img />', { src: url }); };

  //  aTag :: {count: Int, text: String} -> DOM
  var aTag = function (t, c) { return $('<a />', { style: 'font-size:'+c+'em', html: t}); };

  var countToP = function(counts) {
    return Object.keys(counts).map(function(t) {
      return aTag(t, counts[t]);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////
  // Flickr api

  //  flickrFeed :: Future FlickrSearch
  var flickrFeed = getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&format=json&jsoncallback=?');

  //  imageUrls :: FlickrSearch -> [URL]
  var imageUrls = compose(_.pluck('m'), _.pluck('media'), _.get('items'));

  //  images :: [URL] -> [DOM]
  var images = compose(map(imageTag), imageUrls);

  //  tags :: FlickrSearch -> [DOM]
  var tags = compose(countToP, _.countBy(_.identity), _.reject(_.isEmpty), _.flatten, _.map(split(' ')), _.pluck('tags'), _.get('items'));

  //  imagesAndTags :: Tuple [DOM] [DOM]
  var imagesAndTags = liftA2(Tuple, images, tags)

  //  widget :: PictureBox
  var widget = PictureBox(map(imagesAndTags, flickrFeed));


  /////////////////////////////////////////////////////////////////////////////////////
  // Youtube api

  //  youtubeFeed :: Future YoutubeSearch
  var youtubeFeed = getJSON('http://gdata.youtube.com/feeds/api/videos?q=cats&alt=json');

  //  firstUrl :: [{url: String}] -> String
  var firstUrl = compose(_.get('url'), _.first);

  //  imageUrls :: YoutubeSearch -> [URL]
  var imageUrls = compose(map(firstUrl), _.pluck('media$thumbnail'), _.pluck('media$group'), _.get('entry'), _.get('feed'));

  //  images :: [URL] -> [DOM]
  var images = compose(map(imageTag), imageUrls);

  //  tags :: YoutubeSearch -> [DOM]
  var tags = compose(countToP, _.countBy(_.identity), _.reject(_.isEmpty), map(compose(_.get('label'), _.last, _.get('category'))), _.get('entry'), _.get('feed')); 

  //  imagesAndTags :: Tuple [DOM] [DOM]
  var imagesAndTags = liftA2(Tuple, images, tags)

  //  youtube_widget :: PictureBox
  var youtube_widget = PictureBox(map(imagesAndTags, youtubeFeed));

  /////////////////////////////////////////////////////////////////////////////////////
  // Test code

  mconcat([widget, youtube_widget]).fork(log, function(x){
    compose(setHtml($('#flickr')), _.first)(x)
    compose(setHtml($('#tagcloud')), _.get(1))(x)
  });
});

