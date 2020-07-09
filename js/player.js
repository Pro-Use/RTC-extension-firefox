/**
 * @license
 @vimeo/player v2.11.0 | (c) 2020 Vimeo | MIT License | https://github.com/vimeo/player.js */
'use strict';
!function(global, factory) {
  if ("object" == typeof exports && "undefined" != typeof module) {
    module.exports = factory();
  } else {
    if ("function" == typeof define && define.amd) {
      define(factory);
    } else {
      (global = global || self).Vimeo = global.Vimeo || {};
      global.Vimeo.Player = factory();
    }
  }
}(this, function() {
  /**
   * @param {!Object} target
   * @param {number} props
   * @return {undefined}
   */
  function defineProperties(target, props) {
    /** @type {number} */
    var i = 0;
    for (; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      /** @type {boolean} */
      descriptor.configurable = true;
      if ("value" in descriptor) {
        /** @type {boolean} */
        descriptor.writable = true;
      }
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  /**
   * @param {string} prop
   * @param {string} action
   * @return {?}
   */
  function getMethodName(prop, action) {
    return 0 === prop.indexOf(action.toLowerCase()) ? prop : "".concat(action.toLowerCase()).concat(prop.substr(0, 1).toUpperCase()).concat(prop.substr(1));
  }
  /**
   * @param {?} f
   * @return {?}
   */
  function isEmpty(f) {
    return /^(https?:)?\/\/((player|www)\.)?vimeo\.com(?=$|\/)/.test(f);
  }
  /**
   * @param {number} a1
   * @return {?}
   */
  function log(a1) {
    var value;
    var args = 0 < arguments.length && void 0 !== a1 ? a1 : {};
    var e = args.id;
    var view = args.url;
    var t = e || view;
    if (!t) {
      throw new Error("An id or url must be passed, either in an options object or as a data-vimeo-id or data-vimeo-url attribute.");
    }
    if (value = t, !isNaN(parseFloat(value)) && isFinite(value) && Math.floor(value) == value) {
      return "https://vimeo.com/".concat(t);
    }
    if (isEmpty(t)) {
      return t.replace("http:", "https:");
    }
    if (e) {
      throw new TypeError("\u201c".concat(e, "\u201d is not a valid video id."));
    }
    throw new TypeError("\u201c".concat(t, "\u201d is not a vimeo.com url."));
  }
  /**
   * @param {!Object} player
   * @param {string} name
   * @param {?} callback
   * @return {undefined}
   */
  function storeCallback(player, name, callback) {
    var playerCallbacks = util.get(player.element) || {};
    if (!(name in playerCallbacks)) {
      /** @type {!Array} */
      playerCallbacks[name] = [];
    }
    playerCallbacks[name].push(callback);
    util.set(player.element, playerCallbacks);
  }
  /**
   * @param {!Object} o
   * @param {string} arg1
   * @return {?}
   */
  function get(o, arg1) {
    return (util.get(o.element) || {})[arg1] || [];
  }
  /**
   * @param {!Object} elem
   * @param {string} dir
   * @param {!Object} value
   * @return {?}
   */
  function next(elem, dir, value) {
    var rule = util.get(elem.element) || {};
    if (!rule[dir]) {
      return true;
    }
    if (!value) {
      return rule[dir] = [], util.set(elem.element, rule), true;
    }
    var key = rule[dir].indexOf(value);
    return -1 !== key && rule[dir].splice(key, 1), util.set(elem.element, rule), rule[dir] && 0 === rule[dir].length;
  }
  /**
   * @param {!Object} item
   * @param {number} params
   * @return {?}
   */
  function parse(item, params) {
    var options = 1 < arguments.length && void 0 !== params ? params : {};
    return props.reduce(function(parameters, key) {
      var val = item.getAttribute("data-vimeo-".concat(key));
      return !val && "" !== val || (parameters[key] = "" === val ? 1 : val), parameters;
    }, options);
  }
  /**
   * @param {?} _ref
   * @param {!Object} element
   * @return {?}
   */
  function createEmbed(_ref, element) {
    var code = _ref.html;
    if (!element) {
      throw new TypeError("An element must be provided");
    }
    if (null !== element.getAttribute("data-vimeo-initialized")) {
      return element.querySelector("iframe");
    }
    /** @type {!Element} */
    var r = document.createElement("div");
    return r.innerHTML = code, element.appendChild(r.firstChild), element.setAttribute("data-vimeo-initialized", "true"), element.querySelector("iframe");
  }
  /**
   * @param {?} url
   * @param {number} callback
   * @param {!Object} selector
   * @return {?}
   */
  function getOEmbedData(url, callback, selector) {
    var obj = 1 < arguments.length && void 0 !== callback ? callback : {};
    var element = 2 < arguments.length ? selector : void 0;
    return new Promise(function(t, cb) {
      if (!isEmpty(url)) {
        throw new TypeError("\u201c".concat(url, "\u201d is not a vimeo.com url."));
      }
      /** @type {string} */
      var id = "https://vimeo.com/api/oembed.json?url=".concat(encodeURIComponent(url));
      var i;
      for (i in obj) {
        if (obj.hasOwnProperty(i)) {
          /** @type {string} */
          id = id + "&".concat(i, "=").concat(encodeURIComponent(obj[i]));
        }
      }
      var client = new ("XDomainRequest" in window ? XDomainRequest : XMLHttpRequest);
      client.open("GET", id, true);
      /**
       * @return {?}
       */
      client.onload = function() {
        if (404 !== client.status) {
          if (403 !== client.status) {
            try {
              /** @type {*} */
              var data = JSON.parse(client.responseText);
              if (403 === data.domain_status_code) {
                return createEmbed(data, element), void cb(new Error("\u201c".concat(url, "\u201d is not embeddable.")));
              }
              t(data);
            } catch (additiveNodes) {
              cb(additiveNodes);
            }
          } else {
            cb(new Error("\u201c".concat(url, "\u201d is not embeddable.")));
          }
        } else {
          cb(new Error("\u201c".concat(url, "\u201d was not found.")));
        }
      };
      /**
       * @return {undefined}
       */
      client.onerror = function() {
        /** @type {string} */
        var e = client.status ? " (".concat(client.status, ")") : "";
        cb(new Error("There was an error fetching the embed code from Vimeo".concat(e, ".")));
      };
      client.send();
    });
  }
  /**
   * @param {!Object} value
   * @return {?}
   */
  function find(value) {
    if ("string" == typeof value) {
      try {
        /** @type {*} */
        value = JSON.parse(value);
      } catch (deprecationWarning) {
        return console.warn(deprecationWarning), {};
      }
    }
    return value;
  }
  /**
   * @param {!Object} player
   * @param {string} name
   * @param {string} data
   * @return {undefined}
   */
  function postMessage(player, name, data) {
    if (player.element.contentWindow && player.element.contentWindow.postMessage) {
      var result = {
        method : name
      };
      if (void 0 !== data) {
        /** @type {string} */
        result.value = data;
      }
      /** @type {number} */
      var dfY1 = parseFloat(navigator.userAgent.toLowerCase().replace(/^.*msie (\d+).*$/, "$1"));
      if (8 <= dfY1 && dfY1 < 10) {
        /** @type {string} */
        result = JSON.stringify(result);
      }
      player.element.contentWindow.postMessage(result, player.origin);
    }
  }
  /**
   * @param {!Object} b
   * @param {!Object} result
   * @return {undefined}
   */
  function callback(b, result) {
    var html;
    /** @type {!Array} */
    var parent = [];
    if ((result = find(result)).event) {
      if ("error" === result.event) {
        get(b, result.data.method).forEach(function(info) {
          /** @type {!Error} */
          var errorB = new Error(result.data.message);
          errorB.name = result.data.name;
          info.reject(errorB);
          next(b, result.data.method, info);
        });
      }
      parent = get(b, "event:".concat(result.event));
      html = result.data;
    } else {
      if (result.method) {
        var o = function(key, a) {
          var b = get(key, a);
          if (b.length < 1) {
            return false;
          }
          var results = b.shift();
          return next(key, a, results), results;
        }(b, result.method);
        if (o) {
          parent.push(o);
          html = result.value;
        }
      }
    }
    parent.forEach(function(url) {
      try {
        if ("function" == typeof url) {
          return void url.call(b, html);
        }
        url.resolve(html);
      } catch (e) {
      }
    });
  }
  /** @type {boolean} */
  var outputFn = "undefined" != typeof global && "[object global]" === {}.toString.call(global);
  /** @type {boolean} */
  var reverseIsSingle = void 0 !== Array.prototype.indexOf;
  /** @type {boolean} */
  var reverseValue = "undefined" != typeof window && void 0 !== window.postMessage;
  if (!(outputFn || reverseIsSingle && reverseValue)) {
    throw new Error("Sorry, the Vimeo Player API is not available in this browser.");
  }
  var value = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
  !function(global) {
    /**
     * @return {undefined}
     */
    function init() {
      if (void 0 === this) {
        throw new TypeError("Constructor WeakMap requires 'new'");
      }
      if (callback(this, "_id", "_WeakMap" + "_" + getUuidlet() + "." + getUuidlet()), 0 < arguments.length) {
        throw new TypeError("WeakMap iterable is not supported");
      }
    }
    /**
     * @param {!Object} item
     * @param {string} value
     * @return {undefined}
     */
    function define(item, value) {
      if (!itemGetTitle(item) || !has.call(item, "_id")) {
        throw new TypeError(value + " method called on incompatible receiver " + typeof item);
      }
    }
    /**
     * @return {?}
     */
    function getUuidlet() {
      return Math.random().toString().substring(2);
    }
    /**
     * @param {!Object} item
     * @return {?}
     */
    function itemGetTitle(item) {
      return Object(item) === item;
    }
    if (!global.WeakMap) {
      /** @type {function(this:Object, *): boolean} */
      var has = Object.prototype.hasOwnProperty;
      /**
       * @param {!Function} o
       * @param {string} name
       * @param {string} val
       * @return {undefined}
       */
      var callback = function(o, name, val) {
        if (Object.defineProperty) {
          Object.defineProperty(o, name, {
            configurable : true,
            writable : true,
            value : val
          });
        } else {
          /** @type {string} */
          o[name] = val;
        }
      };
      /** @type {function(): undefined} */
      global.WeakMap = (callback(init.prototype, "delete", function(item) {
        if (define(this, "delete"), !itemGetTitle(item)) {
          return false;
        }
        var data = item[this._id];
        return !(!data || data[0] !== item || (delete item[this._id], 0));
      }), callback(init.prototype, "get", function(item) {
        if (define(this, "get"), itemGetTitle(item)) {
          var node = item[this._id];
          return node && node[0] === item ? node[1] : void 0;
        }
      }), callback(init.prototype, "has", function(item) {
        if (define(this, "has"), !itemGetTitle(item)) {
          return false;
        }
        var data = item[this._id];
        return !(!data || data[0] !== item);
      }), callback(init.prototype, "set", function(item, data) {
        if (define(this, "set"), !itemGetTitle(item)) {
          throw new TypeError("Invalid value used as weak map key");
        }
        var node = item[this._id];
        return node && node[0] === item ? node[1] = data : callback(item, this._id, [item, data]), this;
      }), callback(init, "_polyfill", true), init);
    }
  }("undefined" != typeof self ? self : "undefined" != typeof window ? window : value);
  var module;
  var Promise = (function(module) {
    var name;
    var exports;
    var DEF;
    /**
     * @return {?}
     */
    DEF = function() {
      /**
       * @param {!Function} options
       * @param {!Element} reference
       * @return {undefined}
       */
      function Element(options, reference) {
        /** @type {!Function} */
        this.fn = options;
        /** @type {!Element} */
        this.self = reference;
        this.next = void 0;
      }
      /**
       * @param {!Function} key
       * @param {!Array} obj
       * @return {undefined}
       */
      function schedule(key, obj) {
        self.add(key, obj);
        cnt = cnt || nextTick(self.drain);
      }
      /**
       * @param {!Object} value
       * @return {?}
       */
      function isThenable(value) {
        var then;
        /** @type {string} */
        var e = typeof value;
        return null == value || "object" != e && "function" != e || (then = value.then), "function" == typeof then && then;
      }
      /**
       * @return {undefined}
       */
      function notify() {
        /** @type {number} */
        var i = 0;
        for (; i < this.chain.length; i++) {
          notifyIsolated(this, 1 === this.state ? this.chain[i].success : this.chain[i].failure, this.chain[i]);
        }
        /** @type {number} */
        this.chain.length = 0;
      }
      /**
       * @param {!Object} self
       * @param {?} cb
       * @param {!Object} chain
       * @return {undefined}
       */
      function notifyIsolated(self, cb, chain) {
        var ret;
        var _then;
        try {
          if (false === cb) {
            chain.reject(self.msg);
          } else {
            if ((ret = true === cb ? self.msg : cb.call(void 0, self.msg)) === chain.promise) {
              chain.reject(TypeError("Promise-chain cycle"));
            } else {
              if (_then = isThenable(ret)) {
                _then.call(ret, chain.resolve, chain.reject);
              } else {
                chain.resolve(ret);
              }
            }
          }
        } catch (graphic) {
          chain.reject(graphic);
        }
      }
      /**
       * @param {string} val
       * @return {undefined}
       */
      function reject(val) {
        var self = this;
        if (!self.triggered) {
          /** @type {boolean} */
          self.triggered = true;
          if (self.def) {
            self = self.def;
          }
          /** @type {string} */
          self.msg = val;
          /** @type {number} */
          self.state = 2;
          if (0 < self.chain.length) {
            schedule(notify, self);
          }
        }
      }
      /**
       * @param {?} el
       * @param {!NodeList} events
       * @param {!Function} f
       * @param {boolean} a
       * @return {undefined}
       */
      function on(el, events, f, a) {
        /** @type {number} */
        var i = 0;
        for (; i < events.length; i++) {
          !function(i) {
            el.resolve(events[i]).then(function(wholeDoc) {
              f(i, wholeDoc);
            }, a);
          }(i);
        }
      }
      /**
       * @param {!Object} self
       * @return {undefined}
       */
      function MakeDefWrapper(self) {
        /** @type {!Object} */
        this.def = self;
        /** @type {boolean} */
        this.triggered = false;
      }
      /**
       * @param {!Function} self
       * @return {undefined}
       */
      function MakeDef(self) {
        /** @type {!Function} */
        this.promise = self;
        /** @type {number} */
        this.state = 0;
        /** @type {boolean} */
        this.triggered = false;
        /** @type {!Array} */
        this.chain = [];
        this.msg = void 0;
      }
      /**
       * @param {!Function} fn
       * @return {undefined}
       */
      function Promise(fn) {
        if ("function" != typeof fn) {
          throw TypeError("Not a function");
        }
        if (0 !== this.__NPO__) {
          throw TypeError("Not a promise");
        }
        /** @type {number} */
        this.__NPO__ = 1;
        var def = new MakeDef(this);
        /**
         * @param {string} fn
         * @param {!Function} type
         * @return {?}
         */
        this.then = function(fn, type) {
          var o = {
            success : "function" != typeof fn || fn,
            failure : "function" == typeof type && type
          };
          return o.promise = new this.constructor(function(t, b) {
            if ("function" != typeof t || "function" != typeof b) {
              throw TypeError("Not a function");
            }
            /** @type {!Function} */
            o.resolve = t;
            /** @type {!Function} */
            o.reject = b;
          }), def.chain.push(o), 0 !== def.state && schedule(notify, def), o.promise;
        };
        /**
         * @param {!Function} rejected
         * @return {?}
         */
        this.catch = function(rejected) {
          return this.then(void 0, rejected);
        };
        try {
          fn.call(void 0, function(p1__3354_SHARP_) {
            (function resolve(data) {
              var r;
              var self = this;
              if (!self.triggered) {
                /** @type {boolean} */
                self.triggered = true;
                if (self.def) {
                  self = self.def;
                }
                try {
                  if (r = isThenable(data)) {
                    schedule(function() {
                      var def_wrapper = new MakeDefWrapper(self);
                      try {
                        r.call(data, function() {
                          resolve.apply(def_wrapper, arguments);
                        }, function() {
                          reject.apply(def_wrapper, arguments);
                        });
                      } catch (result) {
                        reject.call(def_wrapper, result);
                      }
                    });
                  } else {
                    /** @type {string} */
                    self.msg = data;
                    /** @type {number} */
                    self.state = 1;
                    if (0 < self.chain.length) {
                      schedule(notify, self);
                    }
                  }
                } catch (result) {
                  reject.call(new MakeDefWrapper(self), result);
                }
              }
            }).call(def, p1__3354_SHARP_);
          }, function(result) {
            reject.call(def, result);
          });
        } catch (result) {
          reject.call(def, result);
        }
      }
      var builtInProp;
      var cnt;
      var self;
      var v;
      var c;
      var t;
      /** @type {function(this:*): string} */
      var ts = Object.prototype.toString;
      /** @type {!Function} */
      var nextTick = "undefined" != typeof setImmediate ? function(fn) {
        return setImmediate(fn);
      } : setTimeout;
      try {
        Object.defineProperty({}, "x", {});
        /**
         * @param {!Function} obj
         * @param {string} name
         * @param {string} val
         * @param {boolean} config
         * @return {?}
         */
        builtInProp = function(obj, name, val, config) {
          return Object.defineProperty(obj, name, {
            value : val,
            writable : true,
            configurable : false !== config
          });
        };
      } catch (e) {
        /**
         * @param {!Function} obj
         * @param {string} name
         * @param {!Function} val
         * @return {?}
         */
        builtInProp = function(obj, name, val) {
          return obj[name] = val, obj;
        };
      }
      var PromisePrototype = builtInProp({}, "constructor", Promise, !(self = {
        add : function(type, name) {
          t = new Element(type, name);
          if (c) {
            c.next = t;
          } else {
            v = t;
          }
          c = t;
          t = void 0;
        },
        drain : function() {
          var item = v;
          v = c = cnt = void 0;
          for (; item;) {
            item.fn.call(item.self);
            item = item.next;
          }
        }
      }));
      return builtInProp(Promise.prototype = PromisePrototype, "__NPO__", 0, false), builtInProp(Promise, "resolve", function(t) {
        return t && "object" == typeof t && 1 === t.__NPO__ ? t : new this(function(callback, fn) {
          if ("function" != typeof callback || "function" != typeof fn) {
            throw TypeError("Not a function");
          }
          callback(t);
        });
      }), builtInProp(Promise, "reject", function(n) {
        return new this(function(callback, fn) {
          if ("function" != typeof callback || "function" != typeof fn) {
            throw TypeError("Not a function");
          }
          fn(n);
        });
      }), builtInProp(Promise, "all", function(name) {
        var chain = this;
        return "[object Array]" != ts.call(name) ? chain.reject(TypeError("Not an array")) : 0 === name.length ? chain.resolve([]) : new chain(function(callback, fn) {
          if ("function" != typeof callback || "function" != typeof fn) {
            throw TypeError("Not a function");
          }
          var n = name.length;
          /** @type {!Array} */
          var o = Array(n);
          /** @type {number} */
          var broadcasts = 0;
          on(chain, name, function(v2, k) {
            o[v2] = k;
            if (++broadcasts === n) {
              callback(o);
            }
          }, fn);
        });
      }), builtInProp(Promise, "race", function(name) {
        var n = this;
        return "[object Array]" != ts.call(name) ? n.reject(TypeError("Not an array")) : new n(function(callback, fn) {
          if ("function" != typeof callback || "function" != typeof fn) {
            throw TypeError("Not a function");
          }
          on(n, name, function(canCreateDiscussions, identifierPositions) {
            callback(identifierPositions);
          }, fn);
        });
      }), Promise;
    };
    (exports = value)[name = "Promise"] = exports[name] || DEF();
    if (module.exports) {
      module.exports = exports[name];
    }
  }(module = {
    exports : {}
  }, module.exports), module.exports);
  /** @type {!WeakMap} */
  var util = new WeakMap;
  /** @type {!Array} */
  var props = ["autopause", "autoplay", "background", "byline", "color", "controls", "dnt", "height", "id", "loop", "maxheight", "maxwidth", "muted", "playsinline", "portrait", "responsive", "speed", "texttrack", "title", "transparent", "url", "width"];
  /** @type {!WeakMap} */
  var options = new WeakMap;
  /** @type {!WeakMap} */
  var currentTargetTable = new WeakMap;
  var result = function() {
    /**
     * @param {!Object} element
     * @return {?}
     */
    function init(element) {
      var obj;
      var _this = this;
      var opts = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
      if (!function(impromptuInstance, Impromptu) {
        if (!(impromptuInstance instanceof Impromptu)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }(this, init), window.jQuery && element instanceof jQuery && (1 < element.length && window.console && console.warn && console.warn("A jQuery object with multiple elements was passed, using the first element."), element = element[0]), "undefined" != typeof document && "string" == typeof element && (element = document.getElementById(element)), obj = element, !Boolean(obj && 1 === obj.nodeType && "nodeName" in obj && obj.ownerDocument && obj.ownerDocument.defaultView)) {
        throw new TypeError("You must pass either a valid element or a valid id.");
      }
      if ("IFRAME" !== element.nodeName) {
        var iframe = element.querySelector("iframe");
        if (iframe) {
          element = iframe;
        }
      }
      if ("IFRAME" === element.nodeName && !isEmpty(element.getAttribute("src") || "")) {
        throw new Error("The player element passed isn\u2019t a Vimeo embed.");
      }
      if (options.has(element)) {
        return options.get(element);
      }
      this._window = element.ownerDocument.defaultView;
      /** @type {!Object} */
      this.element = element;
      /** @type {string} */
      this.origin = "*";
      var currentTarget = new Promise(function(callback, reject) {
        if (_this._onMessage = function(event) {
          if (isEmpty(event.origin) && _this.element.contentWindow === event.source) {
            if ("*" === _this.origin) {
              _this.origin = event.origin;
            }
            var result = find(event.data);
            if (result && "error" === result.event && result.data && "ready" === result.data.method) {
              /** @type {!Error} */
              var err = new Error(result.data.message);
              return err.name = result.data.name, void reject(err);
            }
            var name = result && "ready" === result.event;
            var value = result && "ping" === result.method;
            if (name || value) {
              return _this.element.setAttribute("data-ready", "true"), void callback();
            }
            callback(_this, result);
          }
        }, _this._window.addEventListener("message", _this._onMessage), "IFRAME" !== _this.element.nodeName) {
          var params = parse(element, opts);
          getOEmbedData(log(params), params, element).then(function(data) {
            var item;
            var type;
            var col;
            var iframe = createEmbed(data, element);
            return _this.element = iframe, _this._originalElement = element, item = element, type = iframe, col = util.get(item), util.set(type, col), util.delete(item), options.set(_this.element, _this), data;
          }).catch(reject);
        }
      });
      return currentTargetTable.set(this, currentTarget), options.set(this.element, this), "IFRAME" === this.element.nodeName && postMessage(this, "ping"), this;
    }
    var Constructor;
    var protoProps;
    var staticProps;
    return Constructor = init, (protoProps = [{
      key : "callMethod",
      value : function(name, value) {
        var _this3 = this;
        var element = 1 < arguments.length && void 0 !== value ? value : {};
        return new Promise(function(n, reject) {
          return _this3.ready().then(function() {
            storeCallback(_this3, name, {
              resolve : n,
              reject : reject
            });
            postMessage(_this3, name, element);
          }).catch(reject);
        });
      }
    }, {
      key : "get",
      value : function(name) {
        var _this3 = this;
        return new Promise(function(n, reject) {
          return name = getMethodName(name, "get"), _this3.ready().then(function() {
            storeCallback(_this3, name, {
              resolve : n,
              reject : reject
            });
            postMessage(_this3, name);
          }).catch(reject);
        });
      }
    }, {
      key : "set",
      value : function(name, result) {
        var _this3 = this;
        return new Promise(function(n, reject) {
          if (name = getMethodName(name, "set"), null == result) {
            throw new TypeError("There must be a value to set.");
          }
          return _this3.ready().then(function() {
            storeCallback(_this3, name, {
              resolve : n,
              reject : reject
            });
            postMessage(_this3, name, result);
          }).catch(reject);
        });
      }
    }, {
      key : "on",
      value : function(id, callback) {
        if (!id) {
          throw new TypeError("You must pass an event name.");
        }
        if (!callback) {
          throw new TypeError("You must pass a callback function.");
        }
        if ("function" != typeof callback) {
          throw new TypeError("The callback must be a function.");
        }
        if (0 === get(this, "event:".concat(id)).length) {
          this.callMethod("addEventListener", id).catch(function() {
          });
        }
        storeCallback(this, "event:".concat(id), callback);
      }
    }, {
      key : "off",
      value : function(data, fn) {
        if (!data) {
          throw new TypeError("You must pass an event name.");
        }
        if (fn && "function" != typeof fn) {
          throw new TypeError("The callback must be a function.");
        }
        if (next(this, "event:".concat(data), fn)) {
          this.callMethod("removeEventListener", data).catch(function(canCreateDiscussions) {
          });
        }
      }
    }, {
      key : "loadVideo",
      value : function(props) {
        return this.callMethod("loadVideo", props);
      }
    }, {
      key : "ready",
      value : function() {
        var result = currentTargetTable.get(this) || new Promise(function(canCreateDiscussions, cb) {
          cb(new Error("Unknown player. Probably unloaded."));
        });
        return Promise.resolve(result);
      }
    }, {
      key : "addCuePoint",
      value : function(ticks, callback) {
        var identifier = 1 < arguments.length && void 0 !== callback ? callback : {};
        return this.callMethod("addCuePoint", {
          time : ticks,
          data : identifier
        });
      }
    }, {
      key : "removeCuePoint",
      value : function(props) {
        return this.callMethod("removeCuePoint", props);
      }
    }, {
      key : "enableTextTrack",
      value : function(name, kind) {
        if (!name) {
          throw new TypeError("You must pass a language.");
        }
        return this.callMethod("enableTextTrack", {
          language : name,
          kind : kind
        });
      }
    }, {
      key : "disableTextTrack",
      value : function() {
        return this.callMethod("disableTextTrack");
      }
    }, {
      key : "pause",
      value : function() {
        return this.callMethod("pause");
      }
    }, {
      key : "play",
      value : function() {
        return this.callMethod("play");
      }
    }, {
      key : "unload",
      value : function() {
        return this.callMethod("unload");
      }
    }, {
      key : "destroy",
      value : function() {
        var self = this;
        return new Promise(function(onstep) {
          currentTargetTable.delete(self);
          options.delete(self.element);
          if (self._originalElement) {
            options.delete(self._originalElement);
            self._originalElement.removeAttribute("data-vimeo-initialized");
          }
          if (self.element && "IFRAME" === self.element.nodeName && self.element.parentNode) {
            self.element.parentNode.removeChild(self.element);
          }
          self._window.removeEventListener("message", self._onMessage);
          onstep();
        });
      }
    }, {
      key : "getAutopause",
      value : function() {
        return this.get("autopause");
      }
    }, {
      key : "setAutopause",
      value : function(e) {
        return this.set("autopause", e);
      }
    }, {
      key : "getBuffered",
      value : function() {
        return this.get("buffered");
      }
    }, {
      key : "getChapters",
      value : function() {
        return this.get("chapters");
      }
    }, {
      key : "getCurrentChapter",
      value : function() {
        return this.get("currentChapter");
      }
    }, {
      key : "getColor",
      value : function() {
        return this.get("color");
      }
    }, {
      key : "setColor",
      value : function(e) {
        return this.set("color", e);
      }
    }, {
      key : "getCuePoints",
      value : function() {
        return this.get("cuePoints");
      }
    }, {
      key : "getCurrentTime",
      value : function() {
        return this.get("currentTime");
      }
    }, {
      key : "setCurrentTime",
      value : function(e) {
        return this.set("currentTime", e);
      }
    }, {
      key : "getDuration",
      value : function() {
        return this.get("duration");
      }
    }, {
      key : "getEnded",
      value : function() {
        return this.get("ended");
      }
    }, {
      key : "getLoop",
      value : function() {
        return this.get("loop");
      }
    }, {
      key : "setLoop",
      value : function(e) {
        return this.set("loop", e);
      }
    }, {
      key : "setMuted",
      value : function(e) {
        return this.set("muted", e);
      }
    }, {
      key : "getMuted",
      value : function() {
        return this.get("muted");
      }
    }, {
      key : "getPaused",
      value : function() {
        return this.get("paused");
      }
    }, {
      key : "getPlaybackRate",
      value : function() {
        return this.get("playbackRate");
      }
    }, {
      key : "setPlaybackRate",
      value : function(e) {
        return this.set("playbackRate", e);
      }
    }, {
      key : "getPlayed",
      value : function() {
        return this.get("played");
      }
    }, {
      key : "getSeekable",
      value : function() {
        return this.get("seekable");
      }
    }, {
      key : "getSeeking",
      value : function() {
        return this.get("seeking");
      }
    }, {
      key : "getTextTracks",
      value : function() {
        return this.get("textTracks");
      }
    }, {
      key : "getVideoEmbedCode",
      value : function() {
        return this.get("videoEmbedCode");
      }
    }, {
      key : "getVideoId",
      value : function() {
        return this.get("videoId");
      }
    }, {
      key : "getVideoTitle",
      value : function() {
        return this.get("videoTitle");
      }
    }, {
      key : "getVideoWidth",
      value : function() {
        return this.get("videoWidth");
      }
    }, {
      key : "getVideoHeight",
      value : function() {
        return this.get("videoHeight");
      }
    }, {
      key : "getVideoUrl",
      value : function() {
        return this.get("videoUrl");
      }
    }, {
      key : "getVolume",
      value : function() {
        return this.get("volume");
      }
    }, {
      key : "setVolume",
      value : function(e) {
        return this.set("volume", e);
      }
    }]) && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), init;
  }();
  return outputFn || (function(type) {
    /**
     * @param {?} reason
     * @return {undefined}
     */
    function reject(reason) {
      if ("console" in window && console.error) {
        console.error("There was an error creating an embed: ".concat(reason));
      }
    }
    var t = 0 < arguments.length && void 0 !== type ? type : document;
    [].slice.call(t.querySelectorAll("[data-vimeo-id], [data-vimeo-url]")).forEach(function(element) {
      try {
        if (null !== element.getAttribute("data-vimeo-defer")) {
          return;
        }
        var params = parse(element);
        getOEmbedData(log(params), params, element).then(function(data) {
          return createEmbed(data, element);
        }).catch(reject);
      } catch (newException) {
        reject(newException);
      }
    });
  }(), function(blockContext) {
    var target = 0 < arguments.length && void 0 !== blockContext ? blockContext : document;
    if (!window.VimeoPlayerResizeEmbeds_) {
      /** @type {boolean} */
      window.VimeoPlayerResizeEmbeds_ = true;
      window.addEventListener("message", function(options) {
        if (isEmpty(options.origin) && options.data && "spacechange" === options.data.event) {
          var iframes = target.querySelectorAll("iframe");
          /** @type {number} */
          var i = 0;
          for (; i < iframes.length; i++) {
            if (iframes[i].contentWindow === options.source) {
              /** @type {string} */
              iframes[i].parentElement.style.paddingBottom = "".concat(options.data.data[0].bottom, "px");
              break;
            }
          }
        }
      });
    }
  }()), result;
});
