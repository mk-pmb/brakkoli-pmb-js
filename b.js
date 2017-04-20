/*jslint indent: 2, maxlen: 80, continue: false, unparam: false */
/* -*- tab-width: 2 -*- */
/*global define: true, module: true, require: true */
((typeof define === 'function') && define.amd ? define : function (factory) {
  'use strict';
  var m = ((typeof module === 'object') && module), e = (m && m.exports);
  if (e) { m.exports = (factory(require, e, m) || m.exports); }
})(function () {
  'use strict';

  var EX, dfCmd, emptyStringInArray = [''],
    arrSlc = emptyStringInArray.slice, isAry = Array.isArray;

  function ifObj(x, d) { return ((x && typeof x) === 'object' ? x : d); }
  function ifFun(x, d) { return (typeof x === 'function' ? x : d); }
  function isStr(x) { return (typeof x === 'string'); }
  //function toUpper(x) { return String(x).toUpperCase(); }

  function dictMap(d, f) {
    return Object.keys(d).sort().map(function (k) { return f(k, d[k]); });
  }

  function lpad(x, len, pad) {
    pad = (pad || '0');
    var miss = len - (+x.length || 0);
    if (miss < 1) { return x; }
    while (pad.length < miss) { pad += pad; }
    return pad.substr(0, len) + x;
  }

  function xmlq(x) { return String(x).replace(xmlq.rx, xmlq.ent); }
  xmlq.rx = /[&<>"']/g;
  xmlq.ent = (function (ent) { return function (m) { return ent[m]; }; }
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }));


  function fxCmdCore(fxcfg, cmd, arg, fxcmd) {
    if (!fxcfg) { throw new Error('False-y fxcfg!'); }
    var func = ifFun(fxcfg.cmds[cmd] || EX.defaultCommands[cmd]);
    if (!func) { throw new Error('Unsupported effect command: ' + cmd); }
    return func(arg, fxcmd, fxcfg);
  }


  EX = function (fxdefaults) {
    function brakk(spec) {
      if (arguments.length > 1) {
        spec = emptyStringInArray.concat(arrSlc.call(arguments));
      } else if (!ifObj(spec)) {
        throw new TypeError('Expected an array as spec');
      }
      return fxCmdCore(brakk.fxcfg, 'render', spec);
    }
    brakk.fxcfg = Object.assign({}, EX.globalFxDefaults, fxdefaults);
    return brakk;
  };


  EX.globalFxDefaults = {
    cmds: false,
    tplSlotRx: /&$([\w\-]*);/g,
    tplData: false,
  };


  EX.defaultCommands = dfCmd = {};


  dfCmd.render = function (spec, parentFxcmd, parentFxcfg) {
    var fxcfg = (parentFxcfg || parentFxcmd('fx'));

    function fxcmd(cmd, arg) {
      if (cmd === 'fx') {
        if (!arg) { return fxcfg; }
        if (fxcfg === parentFxcfg) { fxcfg = Object.assign({}, fxcfg); }
        return Object.assign(fxcfg, arg);
      }
      arg = fxCmdCore(fxcfg, cmd, arg, fxcmd);
      if (arg && isStr(arg)) { fxcmd.rslt += arg; }
    }
    fxcmd.head = null;
    fxcmd.rslt = '';

    function renderElem(elem) {
      if (elem === undefined) { return; }
      if (elem === null) { return; }
      if (ifObj(elem)) {
        if (isAry(elem)) {
          if (fxcmd.head === null) { fxcmd.head = ''; }
          return fxcmd('render', elem);
        }
        return dictMap(elem, fxcmd);
      }
      if ((fxcmd.head === null) && isStr(elem)) {
        fxcmd.head = elem;
        return;
      }
      return fxcmd('text', elem);
    }

    (function () {
      if (isStr(spec)) { return renderElem(spec); }
      if (isAry(spec)) { return spec.forEach(renderElem); }
    }());

    if (fxcmd.head) { EX.wrapInTag(fxcmd, fxcfg); }
    return fxcmd.rslt;
  };


  EX.wrapInTag = function (fxcmd, fxcfg) {
    var head = String(fxcmd.head), tagName, close = '',
      ind = fxcfg.indent, sub = fxcmd.rslt;
    if (head.substr(0, 3) === '!--') {
      close = ' -->';
    } else {
      if (head.slice(-1) !== '>') {
        tagName = head.split(/\s/)[0];
        close = '</' + tagName + '>';
        head += '>';
      }
    }
    if (ind) {
      if (sub && sub.match(/<|\n/)) {
        sub = sub.replace(/(^|\n)/g, '\n' + ind).replace(/\s*$/, '\n');
      }
      close += '\n';
    }
    fxcmd.rslt = '<' + head + sub + close;
  };


  dfCmd.indentTags = function (ind, fxcmd) {
    if (ind === +ind) { ind = lpad('', ind, ' '); }
    fxcmd('fx', { indent: String(ind) });
  };


  dfCmd.text = xmlq;


  dfCmd.attr = function (attrs, fxcmd) {
    var head = fxcmd.head, close = '';
    if (!head) {
      head = '!-- E_NO_TAG';
    } else {
      close = (head.match(/\s*\/?>$/) || '');
      if (close) {
        head = head.slice(0, close.index);
        close = close[0];
      }
    }
    fxcmd.head = head + dfCmd.quoteAttrs(attrs) + close;
  };


  dfCmd.quoteAttrs = function (attrs) {
    return dictMap(attrs, function (attr, val) {
      return ' ' + xmlq(attr.replace(/_/g, '-')) + '="' + xmlq(val) + '"';
    }).join('');
  };


  dfCmd.metaHttpEquiv = function (attrs, fxcmd) {
    dictMap(attrs, function (attr, val) {
      fxcmd('render', 'meta http-equiv="' + xmlq(attr.replace(/_/g, '-')
        ) + '" content="' + xmlq(val) + '" />');
    });
  };


  dfCmd.link_css = function (attrs, fxcmd) {
    if (isStr(attrs)) { attrs = { href: attrs }; }
    fxcmd('render', 'link rel="stylesheet" type="text/css"' +
      dfCmd.quoteAttrs(attrs) + ' />');
  };
























  return EX;
});
