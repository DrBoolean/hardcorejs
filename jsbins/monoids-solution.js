requirejs.config({
  shim: {},
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    ramda: 'https://raw.githack.com/CrossEye/ramda/master/ramda',
    monoids: 'http://looprecur.com/hostedjs/v2/monoids',
    hcjs: 'http://looprecur.com/hostedjs/v2/hcjs'
  }
});

require(
  [
    'ramda',
    'monoids',
    'hcjs',
    'domReady!'
  ],
  function (_, Monoids) {
    console.clear();

    var Sum = Monoids.Sum;
    var Product = Monoids.Product;
    var Max = Monoids.Max;
    var Min = Monoids.Min;
    var Any = Monoids.Any;
    var All = Monoids.All;
    var getResult = Monoids.getResult;




    // Exercise 1
    // ==========
    // rewrite the ex1 function to use getResult() mconcat() and Sum() instead of sum()
    console.log("--------Start exercise 1--------");

    var sum = _.reduce(_.add, 0);

    var ex1 = compose(getResult, mconcat, map(Sum));

    assertEqual(6, ex1([1, 2, 3]));
    console.log("exercise 1...ok!");




    // Exercise 2
    // ==========
    // Similar to the above, get the Product of the list.
    console.log("--------Start exercise 2--------");

    ex2 = compose(getResult, mconcat, map(Product));

    assertEqual(12, ex2([2, 2, 3]));
    console.log("exercise 2...ok!");



    // Exercise 3
    // ==========
    // Similar to the above, get the Max of the list.
    console.log("--------Start exercise 3--------");
    ex3 = compose(getResult, mconcat, map(Max));

    assertEqual(32, ex3([12, 32, 3]));
    console.log("exercise 3...ok!");




    // Exercise 4
    // ==========
    // use the function monoid instance to mconcat the functions below to create a full name string.
    console.log("--------Start exercise 4--------");
    var firstName = _.get('first');
    var middleName = _.get('middle');
    var lastName = _.get('last');
    var space = _.K(' ');

    var ex4 = mconcat([firstName, space, middleName, space, lastName]);

    var user = {
      first: "Bill",
      middle: "Jefferson",
      last: "Clinton"
    };
    assertEqual("Bill Jefferson Clinton", ex4(user));
    console.log("exercise 4...ok!");




    // Exercise 5
    // ==========
    // For Tuple to be a monoid, it's x,y must also be monoids. Monoids beget monoids.
    // Use this information to complete the definition of Tuple's concat fn.
    console.log("--------Start exercise 5--------");

    var Tuple = _.curry(function (x, y) {
      return new _Tuple(x, y);
    });

    var _Tuple = function (x, y) {
      this.x = x;
      this.y = y;
    };

    _Tuple.prototype.inspect = function () {
      return 'Tuple(' + inspectIt(this.x) + ' ' + inspectIt(this.y) + ')';
    };

    _Tuple.prototype.empty = function () {
      return Tuple(this.x.empty(), this.y.empty());
    };


    // TODO: DEFINE ME
    _Tuple.prototype.concat = function (t2) {
      return Tuple(this.x.concat(t2.x), this.y.concat(t2.y));
    };

    var ex5 = mconcat([Tuple("abc", [1, 2, 3]), Tuple("def", [4, 5, 6])]);

    assertEqual(Tuple("abcdef", [1, 2, 3, 4, 5, 6]), ex5);
    console.log("exercise 5...ok!");


  });
