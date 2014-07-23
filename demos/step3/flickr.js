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
    var imageTag = function (url) {
      return $('<img />', {
        src: url
      });
    };

    //  aTag :: {count: Int, text: String} -> DOM
    var aTag = function (t, c) {
      return $('<a />', {
        style: 'font-size:' + c + 'em',
        html: t
      });
    };

    var countToP = function (counts) {
      return Object.keys(counts).map(function (t) {
        return aTag(t, counts[t]);
      });
    };

    /////////////////////////////////////////////////////////////////////////////////////
    // PictureBox

    //  PictureBox = data
    //    val :: Future(a)
    var _PictureBox = function (val) {
      this.val = val;
      this.fork = this.val.fork;
    };

    var PictureBox = function (x) {
      return new _PictureBox(x);
    };

    // instance Monoid PictureBox where
    _PictureBox.prototype.empty = function () {
      return PictureBox(Future.of(Tuple));
    };
    _PictureBox.prototype.concat = function (y) {
      return PictureBox(this.val.concat(y.val));
    };

    /////////////////////////////////////////////////////////////////////////////////////
    // Flickr api

    //  url :: String -> URL
    var url = function (t) {
      return 'http://api.flickr.com/services/feeds/photos_public.gne?tags=' + t + '&format=json&jsoncallback=?';
    };

    //  src :: FlickrItem -> URL
    var src = compose(_.get('m'), _.get('media'));

    //  srcs :: FlickrSearch -> [URL]
    var srcs = compose(map(src), _.get('items'));

    //  images :: FlickrSearch -> [DOM]
    var images = compose(map(imageTag), srcs);

    //  tags :: FlickrSearch -> [DOM]
    var tags = compose(countToP, _.countBy(_.identity), _.reject(_.isEmpty), _.flatten, _.map(split(' ')), _.pluck('tags'), _.get('items'));

    //  imagesAndTags :: Tuple [DOM] [DOM]
    var imagesAndTags = liftA2(Tuple, images, tags);

    //  widget :: String -> PictureBox
    var widget = compose(PictureBox, map(imagesAndTags), getJSON, url);


    /////////////////////////////////////////////////////////////////////////////////////
    // Test code

    mconcat([widget('cats'), widget('dogs')]).fork(log, function (x) {
      compose(setHtml($('#flickr')), _.first)(x);
      compose(setHtml($('#tagcloud')), _.last)(x);
    });
  });
