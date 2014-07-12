/*jslint nomen: true */
requirejs.config({
  shim: {
  },
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    handlebars: '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.4/handlebars.amd',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    ramda: 'https://raw.githack.com/CrossEye/ramda/master/ramda',
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
  'handlebars',
  'lambda',
  'pointfree',
  'future',
  'bacon',
  'io',
  'monoids',
  'domReady!'
],
function (_, H, L, pf, Future, b, io, Monoids) {
  io.extendFn();
  L.expose(window);
  pf.expose(window);
  var Handlebars = H.default;
  var runIO = io.runIO,
    IO      = io.IO,
    compose = _.compose,
    map     = _.map,
    targetValue    = compose(_.get('value'), _.get('target')),
    listen  = _.curry(function(name, el) { return b.fromEventTarget(el, name); }),
    $       = function (sel) { return document.querySelector(sel); }.toIO(),
    getJSON  = function (url) {
      return new Future(function(rej, res){
        return jQuery.getJSON(url,res);
      });
    },
    setHtml = _.curry(function(sel, h){ $(sel).runIO().innerHTML = h; }).toIO(),
    getFromStorage = function(name){ return JSON.parse(localStorage[name]); }.toIO(),
    saveToStorage = _.curry(function(name, val){ localStorage[name] = JSON.stringify(val); return val; }).toIO(),
    log         = function(x){ console.log(x); return x };


    var todosView = Handlebars.compile($("#todo-tpl").runIO().innerHTML);

    var appendTodo = function(t){
      return map(unshift(t), getFromStorage('todos'));
    }

    var isEnterKey = compose(eq(13), _.get('keyCode')),
        updatePage = compose(setHtml('#main'), todosView),
        renderTodos = compose(chain(updatePage), getFromStorage),
        persistTodo = compose(chain(saveToStorage('todos')), appendTodo),
        appendToList = compose(chain(updatePage), persistTodo,  targetValue),
        saveTodo = compose(map(appendToList), filter(isEnterKey), listen('keyup')),
        addListener = compose(map(saveTodo), $);

  //////////////////////////////////////////////////////////////////////////////

  addListener('input').runIO().onValue(runIO);
  renderTodos('todos').runIO();
});
