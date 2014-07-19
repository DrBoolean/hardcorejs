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

    $.fn.extend({
      concat: function(x) {
        return this.append(x[0].innerHTML);
      }
    });

    var _Widget = function(x) {
      this.val = x;
    };

    _Widget.prototype.empty = function(){ return Future.of($("<div/>")); }
    _Widget.prototype.concat = function(y){
      return liftA2(curry(function(div1, div2){
        div1.find('img').concat(div2.find('img'))
      }), this.val, y.val);
   //   return this.val.concat(y.val);
    }

    var Widget = function(x) {
      return new _Widget(x);
    }

    //+ Flickr :: Future(Div)
    var Flickr = function() {
      var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?';
      var $div = $('<div />', {'class': 'flickr'});

      var makeImage = function(i){ return $('<img />', {src: i.media.media}); },
          makeImages = compose(map(makeImage), _.get('items'))
          makeTags = compose(_.countBy(id), map(compose(split(''), _.get('tag'))), _.get('items'))
          makeWidget = liftA2(Widget, makeTags, makeImages),
          widget = compose(map(makeWidget), getJSON);

      return widget(flickrURL);
    }

  //////////////////////////////////////////////////////////////////////////////


  //var placeOnScreen = compose(io.runIO, chain(setHtml($('#flickr1'))));
  //Flickr().fork(log, setHtml($('#flickr1')));
  //Flickr().fork(log, setHtml($('#flickr2')));
//  mconcat([Flickr(), Flickr()]).fork(log, setHtml($('#flickr1')));
 // makeTagCloud = 
 // compose(makeTagCloud, _.countBy(id), map(splitTags))


});

