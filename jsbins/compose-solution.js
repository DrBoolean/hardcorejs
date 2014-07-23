requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    hcjs: 'http://looprecur.com/hostedjs/v2/hcjs',
    ramda: 'https://raw.githack.com/CrossEye/ramda/master/ramda'
  }
});

require(
  [
    'ramda',
    'hcjs',
    'domReady!'
  ],
  function (_) {
    console.clear();



    /******************************************
        C O M P O S I T I O N  E X A M P L E
    ******************************************/

    // Curried functions are easy to compose.
    // Using _.map, _.size, and _.split we can
    // make a function that returns the lengths
    // of the words in a string.

    var lengths = _.compose(
      _.map(_.size), _.split(' ')
    );
    console.log(lengths('once upon a time'));




    /*******************************************
                   Y O U R  T U R N
    ********************************************/

    var articles = [{
      title: 'Everything Sucks',
      url: 'http://do.wn/sucks.html',
      author: {
        name: 'Debbie Downer',
        email: 'debbie@do.wn'
      }
    }, {
      title: 'If You Please',
      url: 'http://www.geocities.com/milq',
      author: {
        name: 'Caspar Milquetoast',
        email: 'hello@me.com'
      }
    }];

    console.log("--------Start exercise 1--------");
    // -- Challenge 1 -------------------------
    // Return a list of the author names in
    // articles using only get, _.compose, and
    // _.map.

    var names = undefined

    assertEqual(
      ['Debbie Downer', 'Caspar Milquetoast'],
      names(articles)
    );

    console.log("--------Exercise 1 pass!--------");




    console.log("--------Start exercise 2--------");
    // -- Challenge 2 -------------------------
    // Make a boolean function that says whether
    // a given person wrote any of the articles.
    // Use the names function you wrote above
    // with _.compose and _.contains.

    var isAuthor = undefined

    assertEqual(
      false,
      isAuthor('New Guy', articles)
    );
    assertEqual(
      true,
      isAuthor('Debbie Downer', articles)
    );

    console.log("--------Exercise 2 pass!--------");




    console.log("--------Start exercise 3--------");
    // -- Challenge 3 -------------------------
    // There is more to point-free programming
    // than compose! Let's build ourselves
    // another function that combines functions
    // to let us write code without glue variables.

    var fork = _.curry(function (lastly, f, g, x) {
      return lastly(f(x), g(x));
    });

    // As you can see, the fork function is a
    // pipeline like compose, except it duplicates
    // its value, sends it to two functions, then
    // sends the results to a combining function.
    //
    // Your challenge: implement a function to
    // compute the average values in a list using
    // only fork, _.divide, _.sum, and _.size.

    var avg = undefined // change this
    assertEqual(3, avg([1, 2, 3, 4, 5]));
    console.log("--------Exercise 3 pass!--------");

  })