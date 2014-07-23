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

    /////////////////////////////////////////////////////////////////////////////////////
    // Youtube api

    //  url :: String -> URL
    var url = function (t) {
      return 'http://gdata.youtube.com/feeds/api/videos?q=' + t + '&alt=json';
    };

    //  src :: YoutubeEntry -> URL
    var src = compose(_.get('url'), _.first, _.get('media$thumbnail'), _.get('media$group'));

    //  srcs :: YoutubeSearch -> [URL]
    var srcs = compose(map(src), _.get('entry'), _.get('feed'));

    //  images :: YoutubeSearch -> [DOM]
    var images = compose(map(imageTag), srcs);

    //  widget :: Future DOM
    var widget = compose(map(images), getJSON, url);


    /////////////////////////////////////////////////////////////////////////////////////
    // Test code

    widget('cats').fork(log, setHtml($('#youtube')));
  });
