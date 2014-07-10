/*jslint nomen: true */
requirejs.config({
  shim: {
  },
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min'
  }
});

require([
  'jquery'
],
function ($) {
//1. fn defintions
//2. loop
//3. inlining

  var flickrURL = 'http://api.flickr.com/services/feeds/photos_public.gne?format=json&jsoncallback=?',
      makeImage = function(i){ return jQuery('<img />', {src: i.media.m}); };

  var getTags = function(item) {
    return item.tags.split(' ').filter(function(x){ return x;});
  }

  var hasTags = function(item){
    var tags = getTags(item);
    return getTags(item).length > 0;
  }

  var getImages = function(items){
    return items.filter(hasTags).map(makeImage);
  }

  var makeTagCloud = function(items) {
    var counts = items.map(getTags).reduce(function(acc, ts){
      ts.map(function(t){
        acc[t] = acc[t] || 0;
        acc[t] += 1;
      })
      return acc;
    }, {});
    return Object.keys(counts).map(function(k){return $('<a/>', {html: k, style:'font-size:'+counts[k]+'em'}) });
  }

  //////////////////////////////////////////////////////////////////////////////

  $.getJSON(flickrURL, function(d){
    $('#tag_cloud').html(makeTagCloud(d.items));
    $('#images').html(getImages(d.items));
  })
});
