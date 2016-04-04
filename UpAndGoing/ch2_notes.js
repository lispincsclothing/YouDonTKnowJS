// JavaScript provides a typeof operator that can examine a value and tell you what type it is:o
// The return value from the typeof operator is always one of six (seven as of ES6! - the "symbol" type) string values. That is, typeof "abc" returns "string", not string.
// Notice how in this snippet the a variable holds every different type of value, and that despite appearances, typeof a is not asking for the "type of a", but rather for the "type of the value currently in a." Only values have types in JavaScript; variables are just simple containers for those values.

var a;
typeof a; // "undefined"

a = "hello world";
typeof a; // "string"

a = 42;
typeof a; // "number"

a = true;
typeof a; // "boolean"

a = null;
typeof a; // "object" -- weird, bug

a = undefined;
typeof a; // "undefined"

a = {
  b: "c"
};
typeof a; // "object"

// typeof null is an interesting case, because it errantly returns "object", when you'd expect it to return "null".  Warning: This is a long-standing bug in JS, but one that is likely never going to be fixed. Too much code on the Web relies on the bug and thus fixing it would cause a lot more bugs!

// two object subtypes are arrays and functions

function foo() {
  return 42;
}

foo.bar = "hello world";

typeof foo; // "function"
typeof foo(); // "number"
typeof foo.bar; // "string"

// The built-in types and subtypes we've just discussed have behaviors exposed as properties and methods that are quite powerful and useful.

var a = "hello world";
var b = 3.14159;

a.length; // 11
a.toUpperCase(); // "HELLO WORLD"
b.toFixed(4); // "3.1416"

// A string value can be wrapped by a String object, a number can be wrapped by a Number object, and a boolean can be wrapped by a Boolean object. For the most part, you don't need to worry about or directly use these object wrapper forms of the values -- prefer the primitive value forms in practically all cases and JavaScript will take care of the rest for you.

// Coercion comes in two forms in JavaScript: explicit and implicit. Explicit coercion is simply that you can see obviously from the code that a conversion from one type to another will occur, whereas implicit coercion is when the type conversion can happen as more of a non-obvious side effect of some other operation.

// explicit
var a = "42";
var b = Number(a);

a; // "42"
b; // 42 -- the number!

// implicit
var a = "42";
var b = a * 1; // "42" implicitly coerced to 42 here

a; // "42"
b; // 42 -- the number!

// The specific list of "falsy" values in JavaScript is as follows:
//
// "" (empty string)
// 0, -0, NaN (invalid number)
// null, undefined
// false

// There are four equality operators: ==, ===, !=, and !==. The ! forms are of course the symmetric "not equal" versions of their counterparts; non-equality should not be confused with inequality.
// The difference between == and === is usually characterized that == checks for value equality and === checks for both value and type equality. However, this is inaccurate. The proper way to characterize them is that == checks for value equality with coercion allowed, and === checks for value equality without allowing coercion; === is often called "strict equality" for this reason.

var a = "42";
var b = 42;

a == b; // true
a === b; // false

// To boil down a whole lot of details to a few simple takeaways, and help you know whether to use == or === in various situations, here are my simple rules:
//
// If either value (aka side) in a comparison could be the true or false value, avoid == and use ===.
// If either value in a comparison could be of these specific values (0, "", or [] -- empty array), avoid == and use ===.
// In all other cases, you're safe to use ==. Not only is it safe, but in many cases it simplifies your code in a way that improves readability.

// The <, >, <=, and >= operators are used for inequality, referred to in the specification as "relational comparison."
// What about coercion? Similar rules as == comparison (though not exactly identical!) apply to the inequality operators. Notably, there are no "strict inequality" operators that would disallow coercion the same way === "strict equality" does.

var a = 41;
var b = "42";
var c = "43";

a < b; // true
b < c; // true

// The biggest gotcha you may run into here with comparisons between potentially different value types -- remember, there are no "strict inequality" forms to use -- is when one of the values cannot be made into a valid number, such as:

var a = 42;
var b = "foo";

a < b; // false
a > b; // false
a == b; // false

// Wait, how can all three of those comparisons be false? Because the b value is being coerced to the "invalid number value" NaN in the < and > comparisons, and the specification says that NaN is neither greater-than nor less-than any other value.
// The == comparison fails for a different reason. a == b could fail if it's interpreted either as 42 == NaN or "42" == "foo" -- as we explained earlier, the former is the case.

// Generally, the same rules apply to a property name as to a variable identifier. However, certain words cannot be used as variables, but are OK as property names. These words are called "reserved words," and include the JS keywords (for, in, if, etc.) as well as null, true, and false.

// You use the var keyword to declare a variable that will belong to the current function scope, or the global scope if at the top level outside of any function.

// Wherever a var appears inside a scope, that declaration is taken to belong to the entire scope and accessible everywhere throughout.
// Metaphorically, this behavior is called hoisting, when a var declaration is conceptually "moved" to the top of its enclosing scope. Technically, this process is more accurately explained by how code is compiled, but we can skip over those details for now.

var a = 2;

foo(); // works because `foo()`
// declaration is "hoisted"

function foo() {
  a = 3;

  console.log(a); // 3

  var a; // declaration is "hoisted"
  // to the top of `foo()`
}

console.log(a); // 2

// When you declare a variable, it is available anywhere in that scope, as well as any lower/inner scopes. For example:

function foo() {
  var a = 1;

  function bar() {
    var b = 2;

    function baz() {
      var c = 3;

      console.log(a, b, c); // 1 2 3
    }

    baz();
    console.log(a, b); // 1 2
  }

  bar();
  console.log(a); // 1
}

foo();

// If you try to access a variable's value in a scope where it's not available, you'll get a ReferenceError thrown. If you try to set a variable that hasn't been declared, you'll either end up creating a variable in the top-level global scope (bad!) or getting an error, depending on "strict mode" (see "Strict Mode"). Let's take a look:

function foo() {
  a = 1; // `a` not formally declared
}

foo();
a; // 1 -- oops, auto global variable :(

// This is a very bad practice. Don't do it! Always formally declare your variables.

// In addition to creating declarations for variables at the function level, ES6 lets you declare variables to belong to individual blocks (pairs of { .. }), using the let keyword. Besides some nuanced details, the scoping rules will behave roughly the same as we just saw with functions:

function foo() {
  var a = 1;

  if (a >= 1) {
    let b = 2;

    while (b < 5) {
      let c = b * 2;
      b++;

      console.log(a + c);
    }
  }
}

foo();
// 5 7 9

// Because of using let instead of var, b will belong only to the if statement and thus not to the whole foo() function's scope. Similarly, c belongs only to the while loop. Block scoping is very useful for managing your variable scopes in a more fine-grained fashion, which can make your code much easier to maintain over time.

// The break is important if you want only the statement(s) in one case to run. If you omit break from a case, and that case matches or runs, execution will continue with the next case's statements regardless of that case matching. This so called "fall through" is sometimes useful/desired:

switch (a) {
  case 2:
  case 10:
    // some cool stuff
    break;
  case 42:
    // other stuff
    break;
  default:
    // fallback
}

// Here, if a is either 2 or 10, it will execute the "some cool stuff" code statements.

// Another form of conditional in JavaScript is the "conditional operator," often called the "ternary operator." It's like a more concise form of a single if..else statement, such as:

var a = 42;

var b = (a > 41) ? "hello" : "world";

// similar to:

// if (a > 41) {
//    b = "hello";
// }
// else {
//    b = "world";
// }

// Strict mode is a big win for code, and you should use it for all your programs.
// You can opt in to strict mode for an individual function, or an entire file, depending on where you put the strict mode pragma:

function foo() {
  "use strict";

  // this code is strict mode

  function bar() {
    // this code is strict mode
  }
}

// this code is not strict mode

"use strict";

function foo() {
  // this code is strict mode

  function bar() {
    // this code is strict mode
  }
}

// this code is strict mode

// One key difference (improvement!) with strict mode is disallowing the implicit auto-global variable declaration from omitting the var:

function foo() {
  "use strict"; // turn on strict mode
  a = 1; // `var` missing, ReferenceError
}

foo();

// Not only can you pass a value (argument) to a function, but a function itself can be a value that's assigned to variables, or passed to or returned from other functions.
// As such, a function value should be thought of as an expression, much like any other value or expression.

var foo = function() {
  // ..
};

var x = function bar() {
  // ..
};

// The second function expression is named (bar), even as a reference to it is also assigned to the x variable. Named function expressions are generally more preferable, though anonymous function expressions are still extremely common.

// There's another way to execute a function expression, which is typically referred to as an immediately invoked function expression (IIFE):

(function IIFE(){
    console.log( "Hello!" );
})();
// "Hello!"

// The outer ( .. ) that surrounds the (function IIFE(){ .. }) function expression is just a nuance of JS grammar needed to prevent it from being treated as a normal function declaration.
//
// The final () on the end of the expression -- the })(); line -- is what actually executes the function expression referenced immediately before it.

function foo() { .. }

// `foo` function reference expression,
// then `()` executes it
foo();

// `IIFE` function expression,
// then `()` executes it
(function IIFE(){ .. })();

// Because an IIFE is just a function, and functions create variable scope, using an IIFE in this fashion is often used to declare variables that won't affect the surrounding code outside the IIFE:

var a = 42;

(function IIFE(){
    var a = 10;
    console.log( a );   // 10
})();

console.log( a );       // 42

// IIFEs can also have return values:

var x = (function IIFE(){
    return 42;
})();

x;  // 42

// You can think of closure as a way to "remember" and continue to access a function's scope (its variables) even once the function has finished running.

function makeAdder(x) {
    // parameter `x` is an inner variable

    // inner function `add()` uses `x`, so
    // it has a "closure" over it
    function add(y) {
        return y + x;
    };

    return add;
}

// `plusOne` gets a reference to the inner `add(..)`
// function with closure over the `x` parameter of
// the outer `makeAdder(..)`
var plusOne = makeAdder( 1 );

// `plusTen` gets a reference to the inner `add(..)`
// function with closure over the `x` parameter of
// the outer `makeAdder(..)`
var plusTen = makeAdder( 10 );

plusOne( 3 );       // 4  <-- 1 + 3
plusOne( 41 );      // 42 <-- 1 + 41

plusTen( 13 );      // 23 <-- 10 + 13

// The most common usage of closure in JavaScript is the module pattern. Modules let you define private implementation details (variables, functions) that are hidden from the outside world, as well as a public API that is accessible from the outside.

function User(){
    var username, password;

    function doLogin(user,pw) {
        username = user;
        password = pw;

        // do the rest of the login work
    }

    var publicAPI = {
        login: doLogin
    };

    return publicAPI;
}

// create a `User` module instance
var fred = User();

fred.login( "fred", "12Battery34!" );

// The User() function serves as an outer scope that holds the variables username and password, as well as the inner doLogin() function; these are all private inner details of this User module that cannot be accessed from the outside world.

// Warning: We are not calling new User() here, on purpose, despite the fact that probably seems more common to most readers. User() is just a function, not a class to be instantiated, so it's just called normally. Using new would be inappropriate and actually waste resources.

// While it may often seem that this is related to "object-oriented patterns," in JS this is a different mechanism.

// If a function has a this reference inside it, that this reference usually points to an object. But which object it points to depends on how the function was called.

// It's important to realize that this does not refer to the function itself, as is the most common misconception.

function foo() {
    console.log( this.bar );
}

var bar = "global";

var obj1 = {
    bar: "obj1",
    foo: foo
};

var obj2 = {
    bar: "obj2"
};

// --------

foo();              // "global"
obj1.foo();         // "obj1"
foo.call( obj2 );   // "obj2"
new foo();          // undefined

// There are four rules for how this gets set, and they're shown in those last four lines of that snippet.
//
// foo() ends up setting this to the global object in non-strict mode -- in strict mode, this would be undefined and you'd get an error in accessing the bar property -- so "global" is the value found for this.bar.
// obj1.foo() sets this to the obj1 object.
// foo.call(obj2) sets this to the obj2 object.
// new foo() sets this to a brand new empty object.

// When you reference a property on an object, if that property doesn't exist, JavaScript will automatically use that object's internal prototype reference to find another object to look for the property on. You could think of this almost as a fallback if the property is missing.
// The internal prototype reference linkage from one object to its fallback happens at the time the object is created. The simplest way to illustrate it is with a built-in utility called Object.create(..).

var foo = {
    a: 42
};

// create `bar` and link it to `foo`
var bar = Object.create( foo );

bar.b = "hello world";

bar.b;      // "hello world"
bar.a;      // 42 <-- delegated to `foo`

// This linkage may seem like a strange feature of the language. The most common way this feature is used -- and I would argue, abused -- is to try to emulate/fake a "class" mechanism with "inheritance."
//
// But a more natural way of applying prototypes is a pattern called "behavior delegation," where you intentionally design your linked objects to be able to delegate from one to the other for parts of the needed behavior.

// There are two main techniques you can use to "bring" the newer JavaScript stuff to the older browsers: polyfilling and transpiling.

// For example, ES6 defines a utility called Number.isNaN(..) to provide an accurate non-buggy check for NaN values, deprecating the original isNaN(..) utility. But it's easy to polyfill that utility so that you can start using it in your code regardless of whether the end user is in an ES6 browser or not

if (!Number.isNaN) {
    Number.isNaN = function isNaN(x) {
        return x !== x;
    };
}

// Not all new features are fully polyfillable. Sometimes most of the behavior can be polyfilled, but there are still small deviations. You should be really, really careful in implementing a polyfill yourself, to make sure you are adhering to the specification as strictly as possible.

// Or better yet, use an already vetted set of polyfills that you can trust, such as those provided by ES5-Shim (https://github.com/es-shims/es5-shim) and ES6-Shim (https://github.com/es-shims/es6-shim).

// There's no way to polyfill new syntax that has been added to the language. The new syntax would throw an error in the old JS engine as unrecognized/invalid.

// So the better option is to use a tool that converts your newer code into older code equivalents. This process is commonly called "transpiling," a term for transforming + compiling.

Here's a quick example of transpiling. ES6 adds a feature called "default parameter values." It looks like this:

function foo(a = 2) {
    console.log( a );
}

foo();      // 2
foo( 42 );  // 42

// Simple, right? Helpful, too! But it's new syntax that's invalid in pre-ES6 engines. So what will a transpiler do with that code to make it run in older environments?

function foo() {
    var a = arguments[0] !== (void 0) ? arguments[0] : 2;
    console.log( a );
}

// The last important detail to emphasize about transpilers is that they should now be thought of as a standard part of the JS development ecosystem and process. JS is going to continue to evolve, much more quickly than before, so every few months new syntax and new features will be added.


// There are quite a few great transpilers for you to choose from. Here are some good options at the time of this writing:
//
// Babel (https://babeljs.io) (formerly 6to5): Transpiles ES6+ into ES5
// Traceur (https://github.com/google/traceur-compiler): Transpiles ES6, ES7, and beyond into ES5
