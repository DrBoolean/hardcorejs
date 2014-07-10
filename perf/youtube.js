/*jslint nomen: true */
requirejs.config({
  shim: {
  },
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    handlebars: '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.4/handlebars.amd'
  }
});

require([
  'jquery',
  'handlebars'
],
function ($, H) {
  var Handlebars = H.default;
  var YOUTUBE_URL = 'http://gdata.youtube.com/feeds/api/videos?term=cats&alt=json';

//1. fn defintions
//2. loop
//3. inlining


  var Item = function(item){
    var getCategory = function() {
      return item.category[1].label;
    }

    var getImage = function() {
      return item['media$group']['media$thumbnail'][0].url;
    }

    var hasCategory = function() {
      return getCategory().length > 0;
    }

    return {hasCategory: hasCategory, getCategory: getCategory, getImage: getImage}
  }


  var HomePage = function(items) {
    var image_view = Handlebars.compile($("#images_template").html());
    var tag_view = Handlebars.compile($("#tag_template").html());

    var getImages = function(){
      return items.filter(function(i){ return i.hasCategory(); }).map(function(i){ return i.getImage(); });
    }

    var getCategories = function(){
      return items.map(function(i){ return i.getCategory(); });
    }

    var getCount = function(acc, c){
      acc[c] = acc[c] || 0;
      acc[c] += 1;
      return acc;
    }

    var makeTagCloud = function() {
      var counts = getCategories().reduce(getCount, {});
      return Object.keys(counts).map(function(k){return {name: k, count: counts[k] } });
    }

    var render = function() {
      $('#tag_cloud').html(tag_view(makeTagCloud()));
      $('#images').html(image_view(getImages()));
    }

    return {render: render}
  };


  $.getJSON(YOUTUBE_URL, function(d) {
    var items = d.feed.entry.map(Item);
    HomePage(items).render();
  });

});

