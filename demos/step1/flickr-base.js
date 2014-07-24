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

    ////////////////////////////////////////////
    // Flickr api

    //  url :: String -> URL
    var url = function (t) {
      return 'http://api.flickr.com/services/feeds/photos_public.gne?tags=' + t + '&format=json&jsoncallback=?';
    };

  });
