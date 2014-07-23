requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    ramda: 'https://raw.githack.com/CrossEye/ramda/master/ramda',
    maybe: 'http://looprecur.com/hostedjs/v2/maybe',
    io: 'http://looprecur.com/hostedjs/v2/io',
    future: 'http://looprecur.com/hostedjs/v2/data.future.umd',
    hcjs: 'http://looprecur.com/hostedjs/v2/hcjs'
  }
});

require(
  [
    'ramda',
    'maybe',
    'io',
    'future',
    'hcjs',
    'domReady!'
  ],
  function (_, Maybe, io, Future) {
    console.clear();

    var runIO = io.runIO;



    // Exercise 1
    // ==========
    // Write a function that add's two possibly null numbers together using Maybe and ap()
    console.log("--------Start exercise 1--------")

    var ex1 = function (x, y) {
      return Maybe.of(_.add).ap(Maybe(x)).ap(Maybe(y))
    };

    assertEqual(Maybe(5), ex1(2, 3))
    assertEqual(Maybe(null), ex1(null, 3))
    console.log("exercise 1...ok!")



    // Exercise 2
    // ==========
    // Rewrite 1 to use liftA2 instead of ap()
    console.log("--------Start exercise 2--------")


    var ex2 = liftA2(_.add);

    assertEqual(Maybe(5), ex2(Maybe(2), Maybe(3)))
    assertEqual(Maybe(null), ex2(Maybe(null), Maybe(3)))
    console.log("exercise 2...ok!")




    // Exercise 3
    // ==========
    // Make a future by running getPost() and getComments() using applicatives, then renders the page with both
    var makeComments = _.reduce(function (acc, c) {
      return acc + "<li>" + c + "</li>"
    }, "")
    var render = _.curry(function (post, comments) {
      return "<div>" + post.title + "</div>" + makeComments(comments);
    })
    console.log("--------Start exercise 3--------")


    var ex3 = Future.of(render).ap(getPost(2)).ap(getComments(2))
      // or
      // var ex3 = liftA2(render, getPost(2), getComments(2))


    ex3.fork(log, function (html) {
      assertEqual("<div>Love them futures</div><li>This class should be illegal</li><li>Monads are like space burritos</li>", html)
      console.log("exercise 3...ok!")
    })




    // Exercise 4
    // ==========
    // setup...
    localStorage.player1 = "toby"
    localStorage.player2 = "sally"

    // Write a function that gets both player1 and player2 from the cache.
    var getCache = function (x) {
      return localStorage[x];
    }.toIO();
    var game = _.curry(function (p1, p2) {
      return p1 + ' vs ' + p2
    })
    console.log("--------Start exercise 4--------")


    var ex4 = liftA2(game, getCache('player1'), getCache('player2'));


    assertEqual("toby vs sally", runIO(ex4))
    console.log("exercise 4...ok!")




    // TEST HELPERS
    // =====================

    function getPost(i) {
      return new Future(function (rej, res) {
        setTimeout(function () {
          res({
            id: i,
            title: 'Love them futures'
          })
        }, 300)
      })
    }

    function getComments(i) {
      return new Future(function (rej, res) {
        setTimeout(function () {
          res(["This class should be illegal", "Monads are like space burritos"])
        }, 300)
      })
    }

    function trim(x) {
      return x.replace('/\S{0,}/g', '');
    }

  });