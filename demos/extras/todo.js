/*jslint nomen: true */
requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    handlebars: 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0/handlebars.amd.min',
    ramda: 'https://cdnjs.cloudflare.com/ajax/libs/ramda/0.2.3/ramda.min',
    bacon: 'https://cdnjs.cloudflare.com/ajax/libs/bacon.js/0.7.14/Bacon',
    hcjs: 'http://looprecur.com/hostedjs/v2/hcjs',
    daggy: 'daggy',
    reader: 'reader',
    maybe: 'data.maybe.umd'
  }
});

require([
    'ramda',
    'handlebars',
    'bacon',
    'hcjs',
    'reader',
    'maybe',
    'domReady!'
  ],
  function (_, H, b, hcjs, Reader, Maybe) {

    // generic helpers
    //////////////////////////////////////////////////////////////////////////////
    var Handlebars = H.default,

      targetValue = compose(_.get('value'), _.get('target')),

      getOrElse = _.curry(function(x, m){ return m.getOrElse(x); }),

      $ = function (sel) { return document.querySelector(sel); }.toIO(),

      setHtml = _.curry(function (sel, h) {
        return $(sel).map(function(s) { s.innerHTML = h; });
      }),

      getFromStorage = function (name) {
        return Maybe.fromNullable(localStorage[name])
      }.toIO(),

      saveToStorage = function (name) {
        return function(val) {
          localStorage[name] = JSON.stringify(val);
          return val;
        }.toIO()
      };


    // pure app
    //////////////////////////////////////////////////////////////////////////////

    var isEnterKey = compose(eq(13), _.get('keyCode')),

      updatePage = setHtml('#main'),

      getTodos = getFromStorage("todos").map(getOrElse("[]")).map(JSON.parse),

      appendTodo = compose(getTodos.map.bind(getTodos), unshift),

      persistTodo = compose(chain(saveToStorage('todos')), appendTodo),

      saveTodo = Reader.ask.map(function (render) {
        return compose(chain(updatePage), map(render), persistTodo);
      });


    // impure calling code
    //////////////////////////////////////////////////////////////////////////////

    var render = Handlebars.compile($('#todo-tpl').runIO().innerHTML);
    var input = _.head(document.getElementsByTagName('input'));

    b.fromEventTarget(input, 'keyup').filter(isEnterKey).map(targetValue).onValue(function(t){
      saveTodo.run(render)(t).runIO();
    });

    getTodos.map(render).chain(updatePage).runIO();
 }
);

