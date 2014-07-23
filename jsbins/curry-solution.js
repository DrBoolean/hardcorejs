requirejs.config({
  shim: {
  },
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

/*****************************************
      C U R R Y I N G  E X A M P L E
******************************************/

// We've got a nice multiply function.
// It takes two arguments.

console.log( _.multiply(3, 4) );

// But it has been secretly curried already 
// so we can feed it fewer arguments and it 
// will return a new function.
//
// How about making a function to double a 
// value? Done.
var double = _.multiply(2);

console.log( double(13) );

/*****************************************
               Y O U R  T U R N
******************************************/

// _.split pulls a string apart around a
// given value
console.log( _.split('i', 'mississippi') );

console.log("--------Start exercise 1--------");
// -- Challenge 1 ------------------------
// Make a function called "words" which 
// returns a list of words in a string.
// Use only the split function and
// currying.
var words =  _.split(' '); // change this
assertEqual(
  ['one', 'two', 'three'],
  words('one two three')
);
    
console.log("--------Exercise 1 pass!--------");



console.log("--------Start exercise 2--------");
// -- Challenge 2 ------------------------
// Create a function to triple every
// number in a list using only
// _.multiply and _.map.

var tripleList = _.map(_.multiply(3));
assertEqual([3,6,9], tripleList([1,2,3]));
console.log("--------Exercise 2 pass!--------");



console.log("--------Start exercise 3--------");
// -- Challenge 3 ------------------------
// Create a function to find the largest
// number in a list. You can use the
// greater(a,b) function which returns the
// greater of its two inputs. You can do
// this with currying and one of the list
// functions _.map, _.filter, or _.reduce.

var greater = function(a,b) {
  return a > b ? a : b;
};

var max = _.reduce(greater, -Infinity)
assertEqual(9, max([1,-3483,9,7,2]));
assertEqual(-1, max([-21,-3483,-2,-1]));


console.log("--------Exercise 3 pass!--------");

})
