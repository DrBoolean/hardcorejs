/*jslint nomen: true */
requirejs.config({
  shim: {},
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
    var getJSON = function (url) {
        return new Future(function (rej, res) {
          return $.getJSON(url, res);
        });
      },
      listen = _.curry(function (name, el) {
        return b.fromEventTarget(el, name);
      }),
      onValue = _.curry(function (f, s) {
        return s.onValue(f);
      }),
      setHtml = _.curry(function ($el, h) {
        $el.html(h);
        return $el;
      }),
      log = function (x) {
        console.log(x);
        return x
      };

    var _empty = function () {
      return {};
    };

    Object.defineProperty(Object.prototype, 'empty', {
      value: _empty,
      writable: true,
      configurable: true,
      enumerable: false
    });

    var _concat = function (y) {
      var that = this;
      Object.keys(y).reduce(function (acc, x) {
        if (acc[x]) {
          acc[x] = y[x].concat(acc[x]);
        } else {
          acc[x] = y[x];
        }
        return acc;
      }, that);
      return that;
    };

    Object.defineProperty(Object.prototype, 'concat', {
      value: _concat,
      writable: true,
      configurable: true,
      enumerable: false
    });

    var Tuple = _.curry(function (x, y) {
      return new _Tuple(x, y)
    })

    var _Tuple = function (x, y) {
      this[0] = x;
      this[1] = y;
    }

    _Tuple.prototype.inspect = function () {
      return 'Tuple(' + inspectIt(this[0]) + ' ' + inspectIt(this[1]) + ')';
    }

    _Tuple.prototype.empty = function () {
      return Tuple(this[0].empty(), this[1].empty())
    };

    _Tuple.prototype.concat = function (t2) {
      return Tuple(this[0].concat(t2[0]), this[1].concat(t2[1]))
    };

    Future.prototype.concat = function (x) {
      return liftA2(concat, this, x);
    }

    //TODO: Remove everything above
    /////////////////////////////////////////////////////////////////////////////////////
    // PictureBox

    //  PictureBox = data
    //    val :: Future([URL])
    var _PictureBox = function (val) {
      this.val = val;
      this.fork = this.val.fork;
    };

    var PictureBox = function (x) {
      return new _PictureBox(x);
    }

    // instance Monoid PictureBox where
    _PictureBox.prototype.empty = function () {
      return PictureBox(Future.of([]));
    };
    _PictureBox.prototype.concat = function (y) {
      return PictureBox(this.val.concat(y.val));
    };

    //  imageTag :: URL -> DOM
    var imageTag = function (url) {
      return $('<img />', {
        src: url
      });
    };

    /////////////////////////////////////////////////////////////////////////////////////
    // Flickr api

    //  flickrFeed :: Future FlickrSearch
    var flickrFeed = getJSON('http://api.flickr.com/services/feeds/photos_public.gne?tags=cat&format=json&jsoncallback=?');

    //  imageUrls :: FlickrSearch -> [URL]
    var imageUrls = compose(_.pluck('m'), _.pluck('media'), _.get('items'));

    //  images :: [URL] -> [DOM]
    var images = compose(map(imageTag), imageUrls);

    //  tags :: FlickrSearch -> Map String Int
    var tags = compose(_.countBy(_.identity), _.reject(_.isEmpty), _.flatten, _.map(split(' ')), _.pluck('tags'), _.get('items'));

    //  imagesAndTags :: Tuple [DOM] (Map String Int)
    var imagesAndTags = liftA2(Tuple, images, tags)

    //  widget :: Future (Tuple DOM (Map String Int))
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

    //  tags :: YoutubeSearch -> Map String Int
    var tags = compose(_.countBy(_.identity), _.reject(_.isEmpty), map(compose(_.get('label'), _.last, _.get('category'))), _.get('entry'), _.get('feed'));

    //  imagesAndTags :: Tuple [DOM] (Map String Int)
    var imagesAndTags = liftA2(Tuple, images, tags)

    //  youtube_widget :: Future DOM
    var youtube_widget = PictureBox(map(imagesAndTags, youtubeFeed));

    /////////////////////////////////////////////////////////////////////////////////////
    // Test code

    mconcat([widget, youtube_widget]).fork(log, function (x) {
      console.log(x);
      compose(setHtml($('#flickr1')), _.first)(x)
    });
  });