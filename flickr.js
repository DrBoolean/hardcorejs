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
    }).toIO(),
    log         = function(x){ console.log(x); return x };

    var _Widget = function(x) {
      this.val = x;
    };

    var concatInnerHtml = _.curry(function(x,y) {
      x.append(y.html());
      y.html('');
      return x.html();
    });

    _Widget.prototype.empty = function(){ return Future.of(IO.of($("<div/>"))); }
    _Widget.prototype.concat = function(y){
      return liftA2(liftA2(concatInnerHtml), this.val, y.val);
    }

    var Widget = function(x) {
      return new _Widget(x);
    }

    var Flickr = function() {
      var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?';
      var $div = $('<div />', {'class': 'flickr'});

      var makeImage = function(i){ return $('<img />', {src: i.media.m, alt: i.title}); },
          makeHtml = compose(setHtml($div), map(makeImage), _.get('items'), log),
          widget = compose(map(makeHtml), getJSON);

      return widget(flickrURL);
      //return Widget(widget(flickrURL));
    }

  //////////////////////////////////////////////////////////////////////////////

  var PreviewTitleFlickr = function() {
    var setPreviewHtml = function(title){ $('#preview').html(title); }.toIO(),
        showTitle = compose(map(setPreviewHtml), Maybe, _.get('alt'), _.get('target')),
        addListener = compose(map(showTitle), listen('click')),
        addPopovers = function($el) {
          addListener($el).onValue(io.runIO);
          return $el;
        }.toIO(),

      widget = compose(map(chain(addPopovers)), log, Flickr);

    return widget();
  }


  var placeOnScreen = compose(io.runIO, chain(setHtml($('#flickr1'))));
  PreviewTitleFlickr().fork(log, placeOnScreen);

  //mconcat([Flickr(), Flickr()]).fork(log, compose(io.runIO, chain(setHtml($('#flickr1')))))
});

