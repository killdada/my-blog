
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.websocket = {}));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  var isObject = function isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  };

  var Dep =
  /*#__PURE__*/
  function () {
    function Dep() {
      classCallCheck(this, Dep);

      this.subs = []; // 观察者对象数组
    }

    createClass(Dep, [{
      key: "addSub",
      value: function addSub(sub) {
        this.subs.push(sub); // 增加一个观察者
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (sub) {
          sub.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;
  /**
   * Object.defineProperty实现响应式
   * get依赖收集
   * set触发更新
   */

  var defineReactive = function defineReactive(obj, key, val) {
    var dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true
      /* 属性可枚举 */
      ,
      configurable: true
      /* 属性可被修改或删除 */
      ,
      get: function reactiveGetter() {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }

        return val;
        /* 实际上会依赖收集，下一小节会讲 */
      },
      set: function reactiveSetter(newVal) {
        if (newVal === val) return;
        dep.notify();
      }
    });
  }; // 通过遍历所有属性的方式对该对象的每一个属性都通过 defineReactive 处理。


  var observer = function observer(value) {
    if (!value || !isObject(value)) return;
    Object.keys(value).forEach(function (key) {
      defineReactive(value, key, value[key]);
    });
  };

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var ncname = '[a-zA-Z_][\\w\\-\\.]*';
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var startTagClose = /^\s*(\/?)>/;
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
  var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;

  var parseHTML = function parseHTML(html, option) {
    var stack = [];
    var currentParent;
    var root;
    var index = 0;

    var advance = function advance(n) {
      index += n;
      html = html.substring(n);
    };

    var parseText = function parseText(text) {
      if (!defaultTagRE.test(text)) return;
      var tokens = [];
      var lastIndex = defaultTagRE.lastIndex = 0;
      var match, index;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        var exp = match[1].trim();
        tokens.push("_s(".concat(exp, ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return tokens.join('+');
    };

    var getAttr = function getAttr(el, name) {
      var remove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var val;

      if ((val = el.attrsMap[name]) != null) {
        if (remove) {
          var list = el.attrsList;

          for (var i = 0, l = list.length; i < l; i++) {
            if (list[i].name === name) {
              list.splice(i, 1);
              break;
            }
          }
        }
      }

      return val;
    };

    var processClass = function processClass(el) {
      var exp = getAttr(el, ':class');

      if (exp) {
        el.classBinding = exp;
      }

      var expC = getAttr(el, 'class', false);

      if (expC) {
        el.staticClass = expC;
      }
    };

    var processIf = function processIf(el) {
      var exp = getAttr(el, 'v-if');

      if (exp) {
        el.if = exp;

        if (!el.ifConditions) {
          el.ifConditions = [];
        }

        el.ifConditions.push({
          exp: exp,
          block: el
        });
      }
    };

    var processFor = function processFor(el) {
      var exp = getAttr(el, 'v-for');

      if (exp) {
        var inMatch = exp.match(forAliasRE);
        el.for = inMatch[2].trim();
        el.alias = inMatch[1].trim();
      }
    };

    var makeAttrsMap = function makeAttrsMap(attrs) {
      var map = {};

      for (var i = 0, l = attrs.length; i < l; i++) {
        map[attrs[i].name] = attrs[i].value;
      }

      return map;
    }; // 找到对应父标签，设置当前父currentParent


    var parseEndTag = function parseEndTag(tagName) {
      var pos;

      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos].lowerCasedTag === tagName.toLowerCase()) {
          break;
        }
      }

      if (pos > 0) {
        stack.length = pos;
        currentParent = stack[pos];
      }
    };

    var parseStartTag = function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: [],
          start: index
        };
        advance(start[0].length);
        var end;
        var attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3]
          });
        }

        if (end) {
          advance(end[0].length);
          match.end = index;
          return match;
        }
      }
    };

    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1]);
          continue;
        }

        if (html.match(startTagOpen)) {
          var startTagMatch = parseStartTag();
          var element = {
            type: 1,
            tag: startTagMatch.tagName,
            lowerCasedTag: startTagMatch.tagName.toLowerCase(),
            attrsList: startTagMatch.attrs,
            attrsMap: makeAttrsMap(startTagMatch.attrs),
            parent: currentParent,
            children: []
          };
          processClass(element);
          processIf(element);
          processFor(element);

          if (!root) {
            root = element;
          }

          if (currentParent) {
            currentParent.children.push(element);
          } // 非自闭合标签 <img/>这种


          if (!startTagMatch.unarySlash) {
            stack.push(element);
            currentParent = element;
          } //...process start tag


          continue;
        }
      } else {
        var text = html.substring(0, textEnd);
        advance(textEnd);
        var expression = void 0;

        if (expression = parseText(text)) {
          currentParent.children.push({
            type: 2,
            text: text,
            expression: expression
          });
        } else {
          currentParent.children.push({
            type: 3,
            text: text
          });
        } //...process text


        continue;
      }
    }

    return root;
  };

  var optimize = function optimize(rootAst) {
    var isStatic = function isStatic(node) {
      if (node.type === 2) {
        return false;
      }

      if (node.type === 3) {
        return true;
      }

      return !node.if && !node.for;
    };

    var markStatic = function markStatic(node) {
      node.static = isStatic(node);

      if (node.type === 1) {
        for (var i = 0, l = node.children.length; i < l; i++) {
          var child = node.children[i];
          markStatic(child);

          if (!child.static) {
            node.static = false;
          }
        }
      }
    };

    var markStaticRoots = function markStaticRoots(node) {
      if (node.type === 1) {
        if (node.static && node.children.length && !(node.children.length === 1 && node.children[0].type === 3)) {
          node.staticRoot = true;
          return;
        } else {
          node.staticRoot = false;
        }
      }
    };

    markStatic(rootAst);
    markStaticRoots(rootAst);
  };

  var parse = function parse(html) {
    return parseHTML(html);
  };

  var generate = function generate(ast) {
    var genIf, genFor, genElement, genChildren, genNode;

    genNode = function genNode(el) {
      if (el.type === 1) {
        return genElement(el);
      }

      return genText(el);
    };

    genChildren = function genChildren(el) {
      var children = el.children;

      if (children && children.length > 0) {
        return "".concat(children.map(genNode).join(','));
      }
    };

    genElement = function genElement(el) {
      if (el.if && !el.ifProcessed) {
        return genIf(el);
      }

      if (el.for && !el.forProcessed) {
        return genFor(el);
      }

      var children = genChildren(el);
      return "_c('".concat(el.tag, "', {\n            staticClass: ").concat(el.attrsMap && el.attrsMap[':class'], ",\n            class: ").concat(el.attrsMap && el.attrsMap['class'], ",\n        }").concat(children ? ", ".concat(children) : '', ")");
    };

    genIf = function genIf(el) {
      el.ifProcessed = true; // 标示位，避免重复

      if (!el.ifConditions.length) return "_e()"; // 没有条件表达式直接返回空节点

      return "(".concat(el.ifConditions[0].exp, ")?").concat(genElement(el.ifConditions[0].block), ": _e()");
    };

    genFor = function genFor(el) {
      el.forProcessed = true; // 标示位，避免重复

      var exp = el.for,
          alias = el.alias;
      var iterator1 = el.iterator1 ? ",".concat(el.iterator1) : '';
      var iterator2 = el.iterator2 ? ",".concat(el.iterator2) : '';
      return "_l((".concat(exp, "),\n            function(").concat(alias).concat(iterator1).concat(iterator2, ") {\n                return ").concat(genElement(el), "\n            }\n        )");
    };

    var genText = function genText(el) {
      return "_v(".concat(el.expression, ")");
    };

    var code = ast ? genElement(ast) : '_c("div")';
    return {
      render: "with(this){return ".concat(code, "}")
    };
  };

  var compiler = function compiler(html) {
    var ast = parse(html);
    optimize(ast);
    console.log('优化后的ast', ast);
    var code = generate(ast);
    console.log('编译后的renderString', code);
    return code;
  };

  var callbacks = [];
  var pending = false;

  var flushCallbacks = function flushCallbacks() {
    var copies = callbacks.slice(0);
    callbacks.length = 0; // 清空callback

    for (var i = 0; i < copies.length; i++) {
      // 依次执行所有callback
      copies[i]();
    }

    pending = false; //执行完所有的callback了，重置标示位
  };

  var nextTick = function nextTick(cb) {
    // 把这个回调推入到回调数组里面,并不马上指向这些回调函数，而是所以同步任何执行完毕以后，
    // 进入异步任务的时候去执行所所有的callbacks
    callbacks.push(cb);

    if (!pending) {
      // 标示位，避免一次性创建多个异步任务，导致更新多次
      pending = true; // 这里直接使用的是setTimeout推入到异步任务里面，实际是Promise - MutationObserver -setImmediate - setTimeout

      setTimeout(flushCallbacks, 0);
    }
  };

  var waiting = false;
  var queue = [];
  var uid = 0;
  var map = new Map(); // queueWatcher 和nexttick里面的思路类似,
  // 额外多了一个去重处理，map映射，如果是同一个id的watcher说明这一段nexttick路程这个watcher实例频繁触发了多次update
  // 我们需要保证不要重复，避免多次去跑run方法更新

  var flushSchedulerQueue = function flushSchedulerQueue() {
    var copies = queue.slice(0);
    queue.length = 0; // 清空

    for (var i = 0; i < copies.length; i++) {
      // 依次执行所有callback
      var watcher = copies[i];
      watcher.run();
      map.delete(watcher.id); // 这个watcher 执行完清空这个map对应的ID映射
    }

    waiting = false; // 所有执行完，重置标示位
  };

  var queueWatcher = function queueWatcher(watcher) {
    var id = watcher.id;

    if (!map.has(id)) {
      map.set(id, true);
      queue.push(watcher);

      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  };

  var Watcher =
  /*#__PURE__*/
  function () {
    function Watcher() {
      classCallCheck(this, Watcher);

      Dep.target = this;
      this.id = ++uid;
    }

    createClass(Watcher, [{
      key: "update",
      value: function update() {
        // 重写watch更新,推入到watcher队列里面去
        console.log('watch' + this.id + ' update');
        queueWatcher(this);
      } // 这个才是真正的视图更新

    }, {
      key: "run",
      value: function run() {
        console.log('watch' + this.id + '视图更新啦～');
      }
    }]);

    return Watcher;
  }();

  var Vue =
  /*#__PURE__*/
  function () {
    /* Vue构造类 */
    function Vue(options) {
      classCallCheck(this, Vue);

      this._data = options.data;

      this._proxy(options.data);

      observer(this._data); // 建立联系， Object.defineProperty get set处理
      // 实际每一个属性都是一个watcher
      // 创建watcher,通过console.log( this._data.test)触发get进行依赖收集

      var watch1 = new Watcher();
      console.log('触发get,收集当前watcher对象', this._data.test1);
      var watch2 = new Watcher();
      console.log('触发get,收集当前watcher对象', this._data.test2); // 打印所有的update之后，才会执行run，最后的视图更新实际在nexttick包裹了
    }

    createClass(Vue, [{
      key: "_proxy",
      value: function _proxy(data) {
        var that = this;
        Object.keys(data).forEach(function (key) {
          Object.defineProperty(that, key, {
            enumerable: true
            /* 属性可枚举 */
            ,
            configurable: true
            /* 属性可被修改或删除 */
            ,
            get: function proxyGetter() {
              return that._data[key];
            },
            set: function reactiveSetter(newVal) {
              that._data[key] = newVal;
            }
          });
        });
      }
    }]);

    return Vue;
  }();

  window.Vue = Vue;
  var html = '<div :class="c" class="demo" v-if="isShow"><span v-for="(item, i) in sz">{{item}}</span></div>';
  compiler(html);

  exports.Vue = Vue;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
