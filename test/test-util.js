/*jslint indent: 2, maxlen: 80, continue: false, unparam: false */
/* -*- tab-width: 2 -*- */
/*global define: true, module: true, require: true */
((typeof define === 'function') && define.amd ? define : function (factory) {
  'use strict';
  var m = ((typeof module === 'object') && module), e = (m && m.exports);
  if (e) { m.exports = (factory(require, e, m) || m.exports); }
})(function (require) {
  'use strict';

  require('usnam-pmb');
  var tu = {}, eq = require('equal-pmb'),
    sortObj = require('deepsortobj'),
    compactJson = require('ersatz-compactjson');

  function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }



  tu.jsonify = function (x) {
    x = compactJson(sortObj(x));
    x = x.replace(/(\],)\n\s*("\\n" \])/g, '$1 $2');
    return x;
  };


  tu.expectEqual = function (ac, ex) {
    if (ifObj(ac)) { ac = sortObj(ac); }
    try { return eq(ac, ex); } catch (ignore) {}
    if (ifObj(ac) && ifObj(ex)) {
      ac = tu.jsonify(ac);
      ex = tu.jsonify(ex);
    }
    eq.lines(ac, ex);
  };













  return tu;
});
