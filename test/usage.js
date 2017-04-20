/*jslint indent: 2, maxlen: 80, node: true */
/* -*- tab-width: 2 -*- */
'use strict';

var tu = require('./test-util.js'),
  rrfs = require('read-resolved-file-sync')(require),
  expectedTree = require('./expect.usage.json'),
  expectedHTML = rrfs('./expect.usage.html');


(function readmeDemo() {
  //#u
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
  //#r
  console.log("+OK usage test passed.");    //= "+OK usage test passed."

















}());
