/*jslint nomen: true */
requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    handlebars: '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.4/handlebars.amd',
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min',
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.2.3/ramda.min',
    lambda: 'https://raw.githack.com/loop-recur/lambdajs/master/dist/lambda.amd',
    pointfree: 'https://raw.githack.com/DrBoolean/pointfree-fantasy/master/dist/pointfree.amd',
    bacon: 'https://cdnjs.cloudflare.com/ajax/libs/bacon.js/0.7.14/Bacon',
    future: 'http://looprecur.com/hostedjs/v2/data.future.umd',
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
    'monoids',
    'domReady!'
  ],
  function (_, H, L, pf, Future, b, Monoids) {
    // {{{ setup
    L.expose(window);
    pf.expose(window);
    var Handlebars = H.default,
      targetValue = compose(_.get('value'), _.get('target')),
      listen = _.curry(function (name, el) {
        return b.fromEventTarget(el, name);
      }),
      $ = function (sel) {
        return document.querySelector(sel);
      },
      setHtml = _.curry(function (sel, h) {
        $(sel).innerHTML = h;
      }),
      getFromStorage = function (name) {
        return JSON.parse(localStorage[name]);
      },
      saveToStorage = _.curry(function (name, val) {
        localStorage[name] = JSON.stringify(val);
        return val;
      }),
      log = function (x) {
        console.log(x);
        return x;
      };
    // }}}

    //////////////////////////////////////////////////////////////////////////////

    var isEnterKey = compose(eq(13), _.get('keyCode')),
      textOnEnter = compose(map(targetValue), filter(isEnterKey), listen('keyup')),
      renderTodos = Handlebars.compile($('#todo-tpl').innerHTML),
      updatePage = compose(setHtml('#main'), renderTodos),

      appendTodo = function (t) {
        return unshift(t, getFromStorage('todos'));
      },
      renderTodos = compose(updatePage, getFromStorage),
      persistTodo = compose(saveToStorage('todos'), appendTodo),
      saveTodo = compose(updatePage, persistTodo);

    //////////////////////////////////////////////////////////////////////////////

    textOnEnter($('input')).onValue(saveTodo);
    renderTodos('todos');
  });