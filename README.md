
<!--#echo json="package.json" key="name" underline="=" -->
brakkoli-pmb
============
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
An SGML (XML, HTML) template engine that uses arrays for hierarchy.
<!--/#echo -->


Early Access Warning
--------------------

This module is in the first stages of development.
Expect major differences between docs and implementation.



Usage
-----

from [test/usage.js](test/usage.js):

<!--#include file="test/usage.js" start="  //#u" stop="  //#r"
  outdent="  " code="javascript" -->
<!--#verbatim lncnt="31" -->
```javascript
var brakk = require('brakkoli-pmb')(), spec,
  recipes = { basicPage: require('brakkoli-html5-pmb/basic_page') };

recipes.createAndSharePage = function (topic, answers) {
  var pg = recipes.basicPage({ indent: 2,
    title: 'Create & share ->your<- ' + topic,
    });
  pg.head.push({ link_css: 'quiz.css' });
  pg.body.push([ 'h1', pg.head.title ],
    [ 'form method="get" action="x-nope://"',
      [ 'ul class="quiz"'].concat(answers.map(recipes.checkboxAnswer)),
      [ 'input type="submit">' ],
      ]);
  return pg;
};

recipes.checkboxAnswer = function (ans) {
  return [ [ 'li', { indentTags: 0,  }, [ 'label',
      [ 'input type="checkbox" name="ingr[]">',
        { attr: { value: ans } } ],
      '\n  ', ans ] ], '\n' ];
};

spec = recipes.createAndSharePage('sandwich', [ 'bacon',
  'lettuce', 'tomato', 'cheese', 'onion',
  'hot & spicy sauce', 'mustard', '"Ben\'s beans"' ]);

tu.expectEqual(brakk(spec),   expectedHTML);
tu.expectEqual(spec,          expectedTree);
```
<!--/include-->


<!--#toc stop="scan" -->



API
---

```javascript
var brakkoliFactory = require('brakkoli-pmb'),
  brakk = brakkoliFactory(),    // <-- using default config
  customBrakk = brakkoliFactory({ tplSlotRx: /\{{2}([\w\-]*)\}{2}/g });
```

`brakk` expects one argument, `spec`, which should be an array.
If multiple argument are given, `spec` is constructed internally
as an array that contains the empty string, followed by all arguments.

`brakk` maintains a dictionary object `fxcfg` to keep track of
special effects settings.
The factory function accepts a single, optional argument `fxdefaults`
with your favorite defaults for `fxcfg`.

`spec`'s elements are processed, in original order, depending on their type:

* `undefined` and `null` values are ignored.
* Any non-Array object: Its keys are processed, in default sort order,
  as _effect commands_ (see below).
* _Tag head_: The first element that's neither of the above.
* _Tag content_: All elements that are neither of the above.

All _tag content_ is converted as described below and concatenated
to construct the initial _result string_.


### Tag head special effects

Currently, the only supported type of _tag head_ is a string.
If the _tag head_ is not empty, the _template effects_ (see below) are applied.
If the _tag head_ still is not empty,
an opening tag is constructed from it,
and is prepended before the _result string_.
If the _tag head_ ends with a character other than `>`,
a closing tag is constructed and appended to the _result string_.


### Tag content special effects

Arrays are converted using `brakk`, and special effect processing is skipped
since it should have happened already, as part of the conversion.

All other values are `String()`ified and then special effects may be applied:
* First, _template effects_.
* If `fxcfg.rawXml !== false`, XML special characters are replaced like
  [xmldefuse](https://www.npmjs.com/package/xmldefuse) does in default mode.


### Template effects

(to be documented)


### Effect commands

* `store` &rarr; Object `upd`: `Object.assign(fxcfg.tplVars, upd);`











Known issues
------------

* needs more/better tests and docs




&nbsp;


License
-------
<!--#echo json="package.json" key=".license" -->
ISC
<!--/#echo -->
