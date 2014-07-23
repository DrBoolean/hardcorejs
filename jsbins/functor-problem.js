requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    hcjs: 'http://looprecur.com/hostedjs/v2/hcjs',
    ramda: 'https://raw.githack.com/CrossEye/ramda/master/ramda',
    maybe: 'http://looprecur.com/hostedjs/v2/maybe',
    id: 'http://looprecur.com/hostedjs/v2/id'
  }
});

require(
  [
    'ramda',
    'maybe',
    'id',
    'hcjs',
    'domReady!'
  ],
  function (_, Maybe, Identity) {
    console.clear();




    // Exercise 1
    // ==========
    // Use _.add(x,y) and map(f,x) to make a function that increments a value inside a functor
    console.log("--------Start exercise 1--------");

    var ex1 = undefined;


    assertEqual(Identity(3), ex1(Identity(2)));
    console.log("exercise 1...ok!");




    // Exercise 2
    // ==========
    // Use _.head to get the first element of the list
    var xs = Identity(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
    console.log("--------Start exercise 2--------");


    var ex2 = undefined;


    assertEqual(Identity('do'), ex2(xs));
    console.log("exercise 2...ok!");




    // Exercise 3
    // ==========
    // Use safeGet and _.head to find the first initial of the user
    var safeGet = _.curry(function (x, o) {
      return Maybe(o[x]);
    });
    var user = {
      id: 2,
      name: "Albert"
    };
    console.log("--------Start exercise 3--------");

    var ex3 = undefined;


    assertEqual(Maybe('A'), ex3(user));
    console.log("exercise 3...ok!");




    // Exercise 4
    // ==========
    // Use Maybe to rewrite ex4 without an if statement
    console.log("--------Start exercise 4--------");

    var ex4 = function (n) {
      if (n) {
        return parseInt(n);;
      }
    };

    ex4 = undefined;


    assertEqual(Maybe(4), ex4("4"));
    console.log("exercise 4...ok!");

  });
