requirejs.config({
  shim: {
  },
  paths: {
    domReady: 'https://cdnjs.cloudflare.com/ajax/libs/require-domReady/2.0.1/domReady.min',
    ramda: 'https://raw.githack.com/CrossEye/ramda/master/ramda',
    pointfree: 'https://raw.githack.com/DrBoolean/pointfree-fantasy/master/dist/pointfree.amd',
    maybe: 'http://looprecur.com/hostedjs/v2/maybe',
    id: 'http://looprecur.com/hostedjs/v2/id',
    io: 'http://looprecur.com/hostedjs/v2/io',
    future: 'http://looprecur.com/hostedjs/v2/data.future.umd',
    lambda: 'http://looprecur.com/hostedjs/v2/lambda.amd',
    hcjs: 'http://looprecur.com/hostedjs/v2/hcjs',
    string: 'http://looprecur.com/hostedjs/v2/string',
    fn: 'http://looprecur.com/hostedjs/v2/function',
    array: 'http://looprecur.com/hostedjs/v2/array'
  }
});

require(
  [
    'ramda',
    'pointfree',
    'maybe',
    'id',
    'io',
    'future',
    'hcjs',
    'domReady!'
  ],
  function (_, pf, Maybe, Identity, io, Future) {
    pf.expose(window); // mixes in map/compose/etc
    console.clear();
    
var runIO = io.runIO;
io.extendFn();



// Exercise 1
// ==========
// Use safeGet and mjoin or chain to safetly get the street name
console.log("--------Start exercise 1--------")

var safeGet = _.curry(function(x,o){ return Maybe(o[x]) })
var user = {id: 2, name: "Albert", address: { street: {number: 22, name: 'Walnut St'} } }

var ex1 = undefined

assertEqual(Maybe('Walnut St'), ex1(user))
console.log("exercise 1...ok!")








// Exercise 2
// ==========
// Use monads to get the href, then purely log it.

console.log("--------Start exercise 2--------")

var getHref = function(){ return location.href }.toIO();
var pureLog = function(x){ console.log(x); return x; }.toIO();

var ex2 = undefined

assertEqual("http://run.jsbin.com/runner", runIO(ex2(null)))
console.log("exercise 2...ok!")









// Exercise 3
// ==========
// Use monads to first get the Post with getPost(), then pass it's id in to getComments().
console.log("--------Start exercise 3--------")

var ex3 = undefined

ex3(13).fork(log, function(res){
  assertEqual(2, res.length)
  console.log("exercise 3...ok!")
})












// HELPERS
// =====================

function getPost(i) {
  return new Future(function(rej, res) {
    setTimeout(function(){
      res({id: i, title: 'Love them futures'})  
    }, 300)
  })
}

function getComments(i) {
  return new Future(function(rej, res) {
    setTimeout(function(){
      res(["This class should be illegal", "Monads are like space burritos"])
    }, 300)
  })
}

function trim(x){ return x.replace('/\S{0,}/g', ''); }
    
 });
