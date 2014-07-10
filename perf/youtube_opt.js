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

  var youtubeURL = 'http://gdata.youtube.com/feeds/api/videos?term=cats&alt=json';

  var makeImage = function(i){
    return $('<img />', {src: i['media$group']['media$thumbnail'][0].url});
  };

  var getCategory = function(item) {
    return item.category[1].label;
  }

  var hasTags = function(item){
    var tags = getCategory(item);
    return getCategory(item).length > 0;
  }

  var getImages = function(items){
    return items.filter(hasTags).map(makeImage);
  }

  var makeTagCloud = function(items) {
    var counts = items.map(getCategory).reduce(function(acc, c){
      acc[c] = acc[c] || 0;
      acc[c] += 1;
      return acc;
    }, {});
    return Object.keys(counts).map(function(k){return $('<a/>', {html: k, style:'font-size:'+counts[k]+'em'}) });
  }

  //////////////////////////////////////////////////////////////////////////////

  $.getJSON(youtubeURL, function(d){
    $('#tag_cloud').html(makeTagCloud(d.feed.entry));
    $('#images').html(getImages(d.feed.entry));
  })
});
