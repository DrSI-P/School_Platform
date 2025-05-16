exports.id = 173;
exports.ids = [173];
exports.modules = {

/***/ 83119:
/***/ ((module) => {

"use strict";

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/scripts/default-index.ts
var default_index_exports = {};
__export(default_index_exports, {
  Prisma: () => Prisma,
  PrismaClient: () => PrismaClient,
  default: () => default_index_default
});
module.exports = __toCommonJS(default_index_exports);

// ../../node_modules/.pnpm/@prisma+engines-version@6.8.0-43.2060c79ba17c6bb9f5823312b6f6b7f4a845738e/node_modules/@prisma/engines-version/package.json
var prisma = {
  enginesVersion: "2060c79ba17c6bb9f5823312b6f6b7f4a845738e"
};

// package.json
var version = "6.8.1";

// src/runtime/utils/clientVersion.ts
var clientVersion = version;

// src/scripts/default-index.ts
var PrismaClient = class {
  constructor() {
    throw new Error('@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.');
  }
};
function defineExtension(ext) {
  if (typeof ext === "function") {
    return ext;
  }
  return (client) => client.$extends(ext);
}
function getExtensionContext(that) {
  return that;
}
var Prisma = {
  defineExtension,
  getExtensionContext,
  prismaVersion: { client: clientVersion, engine: prisma.enginesVersion }
};
var default_index_default = { Prisma };
// Annotate the CommonJS export names for ESM import in node:
0 && (0);


/***/ }),

/***/ 11711:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

exports.arrayLikeToArray = _arrayLikeToArray;
exports.arrayWithHoles = _arrayWithHoles;
exports.defineProperty = _defineProperty;
exports.iterableToArrayLimit = _iterableToArrayLimit;
exports.nonIterableRest = _nonIterableRest;
exports.objectSpread2 = _objectSpread2;
exports.objectWithoutProperties = _objectWithoutProperties;
exports.objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;
exports.slicedToArray = _slicedToArray;
exports.unsupportedIterableToArray = _unsupportedIterableToArray;


/***/ }),

/***/ 39148:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var config = {
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
  }
};

exports["default"] = config;


/***/ }),

/***/ 39812:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var index = __webpack_require__(11244);



exports["default"] = index['default'];


/***/ }),

/***/ 11244:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var _rollupPluginBabelHelpers = __webpack_require__(11711);
var state = __webpack_require__(65847);
var index = __webpack_require__(39148);
var index$1 = __webpack_require__(75210);
var compose = __webpack_require__(91030);
var deepMerge = __webpack_require__(96465);
var makeCancelable = __webpack_require__(21283);

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var state__default = /*#__PURE__*/_interopDefaultLegacy(state);

/** the local state of the module */

var _state$create = state__default['default'].create({
  config: index['default'],
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null
}),
    _state$create2 = _rollupPluginBabelHelpers.slicedToArray(_state$create, 2),
    getState = _state$create2[0],
    setState = _state$create2[1];
/**
 * set the loader configuration
 * @param {Object} config - the configuration object
 */


function config(globalConfig) {
  var _validators$config = index$1['default'].config(globalConfig),
      monaco = _validators$config.monaco,
      config = _rollupPluginBabelHelpers.objectWithoutProperties(_validators$config, ["monaco"]);

  setState(function (state) {
    return {
      config: deepMerge['default'](state.config, config),
      monaco: monaco
    };
  });
}
/**
 * handles the initialization of the monaco-editor
 * @return {Promise} - returns an instance of monaco (with a cancelable promise)
 */


function init() {
  var state = getState(function (_ref) {
    var monaco = _ref.monaco,
        isInitialized = _ref.isInitialized,
        resolve = _ref.resolve;
    return {
      monaco: monaco,
      isInitialized: isInitialized,
      resolve: resolve
    };
  });

  if (!state.isInitialized) {
    setState({
      isInitialized: true
    });

    if (state.monaco) {
      state.resolve(state.monaco);
      return makeCancelable['default'](wrapperPromise);
    }

    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco);
      state.resolve(window.monaco);
      return makeCancelable['default'](wrapperPromise);
    }

    compose['default'](injectScripts, getMonacoLoaderScript)(configureLoader);
  }

  return makeCancelable['default'](wrapperPromise);
}
/**
 * injects provided scripts into the document.body
 * @param {Object} script - an HTML script element
 * @return {Object} - the injected HTML script element
 */


function injectScripts(script) {
  return document.body.appendChild(script);
}
/**
 * creates an HTML script element with/without provided src
 * @param {string} [src] - the source path of the script
 * @return {Object} - the created HTML script element
 */


function createScript(src) {
  var script = document.createElement('script');
  return src && (script.src = src), script;
}
/**
 * creates an HTML script element with the monaco loader src
 * @return {Object} - the created HTML script element
 */


function getMonacoLoaderScript(configureLoader) {
  var state = getState(function (_ref2) {
    var config = _ref2.config,
        reject = _ref2.reject;
    return {
      config: config,
      reject: reject
    };
  });
  var loaderScript = createScript("".concat(state.config.paths.vs, "/loader.js"));

  loaderScript.onload = function () {
    return configureLoader();
  };

  loaderScript.onerror = state.reject;
  return loaderScript;
}
/**
 * configures the monaco loader
 */


function configureLoader() {
  var state = getState(function (_ref3) {
    var config = _ref3.config,
        resolve = _ref3.resolve,
        reject = _ref3.reject;
    return {
      config: config,
      resolve: resolve,
      reject: reject
    };
  });
  var require = window.require;

  require.config(state.config);

  require(['vs/editor/editor.main'], function (monaco) {
    storeMonacoInstance(monaco);
    state.resolve(monaco);
  }, function (error) {
    state.reject(error);
  });
}
/**
 * store monaco instance in local state
 */


function storeMonacoInstance(monaco) {
  if (!getState().monaco) {
    setState({
      monaco: monaco
    });
  }
}
/**
 * internal helper function
 * extracts stored monaco instance
 * @return {Object|null} - the monaco instance
 */


function __getMonacoInstance() {
  return getState(function (_ref4) {
    var monaco = _ref4.monaco;
    return monaco;
  });
}

var wrapperPromise = new Promise(function (resolve, reject) {
  return setState({
    resolve: resolve,
    reject: reject
  });
});
var loader = {
  config: config,
  init: init,
  __getMonacoInstance: __getMonacoInstance
};

exports["default"] = loader;


/***/ }),

/***/ 91030:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var compose = function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (y, f) {
      return f(y);
    }, x);
  };
};

exports["default"] = compose;


/***/ }),

/***/ 31297:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function curry(fn) {
  return function curried() {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.length >= fn.length ? fn.apply(this, args) : function () {
      for (var _len2 = arguments.length, nextArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        nextArgs[_key2] = arguments[_key2];
      }

      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}

exports["default"] = curry;


/***/ }),

/***/ 96465:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var _rollupPluginBabelHelpers = __webpack_require__(11711);

function merge(target, source) {
  Object.keys(source).forEach(function (key) {
    if (source[key] instanceof Object) {
      if (target[key]) {
        Object.assign(source[key], merge(target[key], source[key]));
      }
    }
  });
  return _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, target), source);
}

exports["default"] = merge;


/***/ }),

/***/ 21947:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function isObject(value) {
  return {}.toString.call(value).includes('Object');
}

exports["default"] = isObject;


/***/ }),

/***/ 21283:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

// The source (has been changed) is https://github.com/facebook/react/issues/5465#issuecomment-157888325
var CANCELATION_MESSAGE = {
  type: 'cancelation',
  msg: 'operation is manually canceled'
};

function makeCancelable(promise) {
  var hasCanceled_ = false;
  var wrappedPromise = new Promise(function (resolve, reject) {
    promise.then(function (val) {
      return hasCanceled_ ? reject(CANCELATION_MESSAGE) : resolve(val);
    });
    promise["catch"](reject);
  });
  return wrappedPromise.cancel = function () {
    return hasCanceled_ = true;
  }, wrappedPromise;
}

exports.CANCELATION_MESSAGE = CANCELATION_MESSAGE;
exports["default"] = makeCancelable;


/***/ }),

/***/ 75210:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var curry = __webpack_require__(31297);
var isObject = __webpack_require__(21947);

/**
 * validates the configuration object and informs about deprecation
 * @param {Object} config - the configuration object 
 * @return {Object} config - the validated configuration object
 */

function validateConfig(config) {
  if (!config) errorHandler('configIsRequired');
  if (!isObject['default'](config)) errorHandler('configType');

  if (config.urls) {
    informAboutDeprecation();
    return {
      paths: {
        vs: config.urls.monacoBase
      }
    };
  }

  return config;
}
/**
 * logs deprecation message
 */


function informAboutDeprecation() {
  console.warn(errorMessages.deprecation);
}

function throwError(errorMessages, type) {
  throw new Error(errorMessages[type] || errorMessages["default"]);
}

var errorMessages = {
  configIsRequired: 'the configuration object is required',
  configType: 'the configuration object should be an object',
  "default": 'an unknown error accured in `@monaco-editor/loader` package',
  deprecation: "Deprecation warning!\n    You are using deprecated way of configuration.\n\n    Instead of using\n      monaco.config({ urls: { monacoBase: '...' } })\n    use\n      monaco.config({ paths: { vs: '...' } })\n\n    For more please check the link https://github.com/suren-atoyan/monaco-loader#config\n  "
};
var errorHandler = curry['default'](throwError)(errorMessages);
var validators = {
  config: validateConfig
};

exports["default"] = validators;
exports.errorHandler = errorHandler;
exports.errorMessages = errorMessages;


/***/ }),

/***/ 3822:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
var De=Object.create;var H=Object.defineProperty;var be=Object.getOwnPropertyDescriptor;var ke=Object.getOwnPropertyNames;var Se=Object.getPrototypeOf,Oe=Object.prototype.hasOwnProperty;var Te=(e,t)=>{for(var r in t)H(e,r,{get:t[r],enumerable:!0})},re=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of ke(t))!Oe.call(e,s)&&s!==r&&H(e,s,{get:()=>t[s],enumerable:!(o=be(t,s))||o.enumerable});return e};var D=(e,t,r)=>(r=e!=null?De(Se(e)):{},re(t||!e||!e.__esModule?H(r,"default",{value:e,enumerable:!0}):r,e)),we=e=>re(H({},"__esModule",{value:!0}),e);var Ae={};Te(Ae,{DiffEditor:()=>me,Editor:()=>$,default:()=>je,loader:()=>Re.default,useMonaco:()=>Ee});module.exports=we(Ae);var Re=D(__webpack_require__(39812));var ae=__webpack_require__(18038);var f=D(__webpack_require__(18038)),pe=D(__webpack_require__(39812));var ue=__webpack_require__(18038);var _=D(__webpack_require__(18038));var Ie={wrapper:{display:"flex",position:"relative",textAlign:"initial"},fullWidth:{width:"100%"},hide:{display:"none"}},W=Ie;var ne=D(__webpack_require__(18038));var Pe={container:{display:"flex",height:"100%",width:"100%",justifyContent:"center",alignItems:"center"}},oe=Pe;function Le({children:e}){return ne.default.createElement("div",{style:oe.container},e)}var ie=Le;var ce=ie;function Ue({width:e,height:t,isEditorReady:r,loading:o,_ref:s,className:E,wrapperProps:x}){return _.default.createElement("section",{style:{...W.wrapper,width:e,height:t},...x},!r&&_.default.createElement(ce,null,o),_.default.createElement("div",{ref:s,style:{...W.fullWidth,...!r&&W.hide},className:E}))}var se=Ue;var N=(0,ue.memo)(se);var fe=__webpack_require__(18038);function ve(e){(0,fe.useEffect)(e,[])}var O=ve;var V=__webpack_require__(18038);function He(e,t,r=!0){let o=(0,V.useRef)(!0);(0,V.useEffect)(o.current||!r?()=>{o.current=!1}:e,t)}var M=He;function k(){}function b(e,t,r,o){return We(e,o)||_e(e,t,r,o)}function We(e,t){return e.editor.getModel(de(e,t))}function _e(e,t,r,o){return e.editor.createModel(t,r,o?de(e,o):void 0)}function de(e,t){return e.Uri.parse(t)}function Ne({original:e,modified:t,language:r,originalLanguage:o,modifiedLanguage:s,originalModelPath:E,modifiedModelPath:x,keepCurrentOriginalModel:R=!1,keepCurrentModifiedModel:j=!1,theme:g="light",loading:L="Loading...",options:C={},height:A="100%",width:q="100%",className:B,wrapperProps:G={},beforeMount:J=k,onMount:K=k}){let[y,T]=(0,f.useState)(!1),[w,d]=(0,f.useState)(!0),p=(0,f.useRef)(null),u=(0,f.useRef)(null),I=(0,f.useRef)(null),a=(0,f.useRef)(K),n=(0,f.useRef)(J),S=(0,f.useRef)(!1);O(()=>{let i=pe.default.init();return i.then(l=>(u.current=l)&&d(!1)).catch(l=>l?.type!=="cancelation"&&console.error("Monaco initialization: error:",l)),()=>p.current?P():i.cancel()}),M(()=>{if(p.current&&u.current){let i=p.current.getOriginalEditor(),l=b(u.current,e||"",o||r||"text",E||"");l!==i.getModel()&&i.setModel(l)}},[E],y),M(()=>{if(p.current&&u.current){let i=p.current.getModifiedEditor(),l=b(u.current,t||"",s||r||"text",x||"");l!==i.getModel()&&i.setModel(l)}},[x],y),M(()=>{let i=p.current.getModifiedEditor();i.getOption(u.current.editor.EditorOption.readOnly)?i.setValue(t||""):t!==i.getValue()&&(i.executeEdits("",[{range:i.getModel().getFullModelRange(),text:t||"",forceMoveMarkers:!0}]),i.pushUndoStop())},[t],y),M(()=>{p.current?.getModel()?.original.setValue(e||"")},[e],y),M(()=>{let{original:i,modified:l}=p.current.getModel();u.current.editor.setModelLanguage(i,o||r||"text"),u.current.editor.setModelLanguage(l,s||r||"text")},[r,o,s],y),M(()=>{u.current?.editor.setTheme(g)},[g],y),M(()=>{p.current?.updateOptions(C)},[C],y);let U=(0,f.useCallback)(()=>{if(!u.current)return;n.current(u.current);let i=b(u.current,e||"",o||r||"text",E||""),l=b(u.current,t||"",s||r||"text",x||"");p.current?.setModel({original:i,modified:l})},[r,t,s,e,o,E,x]),v=(0,f.useCallback)(()=>{!S.current&&I.current&&(p.current=u.current.editor.createDiffEditor(I.current,{automaticLayout:!0,...C}),U(),u.current?.editor.setTheme(g),T(!0),S.current=!0)},[C,g,U]);(0,f.useEffect)(()=>{y&&a.current(p.current,u.current)},[y]),(0,f.useEffect)(()=>{!w&&!y&&v()},[w,y,v]);function P(){let i=p.current?.getModel();R||i?.original?.dispose(),j||i?.modified?.dispose(),p.current?.dispose()}return f.default.createElement(N,{width:q,height:A,isEditorReady:y,loading:L,_ref:I,className:B,wrapperProps:G})}var le=Ne;var me=(0,ae.memo)(le);var Me=__webpack_require__(18038),Z=D(__webpack_require__(39812));function Ve(){let[e,t]=(0,Me.useState)(Z.default.__getMonacoInstance());return O(()=>{let r;return e||(r=Z.default.init(),r.then(o=>{t(o)})),()=>r?.cancel()}),e}var Ee=Ve;var ge=__webpack_require__(18038);var c=D(__webpack_require__(18038)),xe=D(__webpack_require__(39812));var z=__webpack_require__(18038);function ze(e){let t=(0,z.useRef)();return(0,z.useEffect)(()=>{t.current=e},[e]),t.current}var ye=ze;var F=new Map;function Fe({defaultValue:e,defaultLanguage:t,defaultPath:r,value:o,language:s,path:E,theme:x="light",line:R,loading:j="Loading...",options:g={},overrideServices:L={},saveViewState:C=!0,keepCurrentModel:A=!1,width:q="100%",height:B="100%",className:G,wrapperProps:J={},beforeMount:K=k,onMount:y=k,onChange:T,onValidate:w=k}){let[d,p]=(0,c.useState)(!1),[u,I]=(0,c.useState)(!0),a=(0,c.useRef)(null),n=(0,c.useRef)(null),S=(0,c.useRef)(null),U=(0,c.useRef)(y),v=(0,c.useRef)(K),P=(0,c.useRef)(),i=(0,c.useRef)(o),l=ye(E),ee=(0,c.useRef)(!1),Q=(0,c.useRef)(!1);O(()=>{let m=xe.default.init();return m.then(h=>(a.current=h)&&I(!1)).catch(h=>h?.type!=="cancelation"&&console.error("Monaco initialization: error:",h)),()=>n.current?he():m.cancel()}),M(()=>{let m=b(a.current,e||o||"",t||s||"",E||r||"");m!==n.current?.getModel()&&(C&&F.set(l,n.current?.saveViewState()),n.current?.setModel(m),C&&n.current?.restoreViewState(F.get(E)))},[E],d),M(()=>{n.current?.updateOptions(g)},[g],d),M(()=>{!n.current||o===void 0||(n.current.getOption(a.current.editor.EditorOption.readOnly)?n.current.setValue(o):o!==n.current.getValue()&&(Q.current=!0,n.current.executeEdits("",[{range:n.current.getModel().getFullModelRange(),text:o,forceMoveMarkers:!0}]),n.current.pushUndoStop(),Q.current=!1))},[o],d),M(()=>{let m=n.current?.getModel();m&&s&&a.current?.editor.setModelLanguage(m,s)},[s],d),M(()=>{R!==void 0&&n.current?.revealLine(R)},[R],d),M(()=>{a.current?.editor.setTheme(x)},[x],d);let te=(0,c.useCallback)(()=>{if(!(!S.current||!a.current)&&!ee.current){v.current(a.current);let m=E||r,h=b(a.current,o||e||"",t||s||"",m||"");n.current=a.current?.editor.create(S.current,{model:h,automaticLayout:!0,...g},L),C&&n.current.restoreViewState(F.get(m)),a.current.editor.setTheme(x),R!==void 0&&n.current.revealLine(R),p(!0),ee.current=!0}},[e,t,r,o,s,E,g,L,C,x,R]);(0,c.useEffect)(()=>{d&&U.current(n.current,a.current)},[d]),(0,c.useEffect)(()=>{!u&&!d&&te()},[u,d,te]),i.current=o,(0,c.useEffect)(()=>{d&&T&&(P.current?.dispose(),P.current=n.current?.onDidChangeModelContent(m=>{Q.current||T(n.current.getValue(),m)}))},[d,T]),(0,c.useEffect)(()=>{if(d){let m=a.current.editor.onDidChangeMarkers(h=>{let X=n.current.getModel()?.uri;if(X&&h.find(Y=>Y.path===X.path)){let Y=a.current.editor.getModelMarkers({resource:X});w?.(Y)}});return()=>{m?.dispose()}}return()=>{}},[d,w]);function he(){P.current?.dispose(),A?C&&F.set(E,n.current.saveViewState()):n.current.getModel()?.dispose(),n.current.dispose()}return c.default.createElement(N,{width:q,height:B,isEditorReady:d,loading:j,_ref:S,className:G,wrapperProps:J})}var Ce=Fe;var $=(0,ge.memo)(Ce);var je=$;0&&(0);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 78553:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  ...__webpack_require__(83119),
}


/***/ }),

/***/ 65847:
/***/ ((module) => {

"use strict";


function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function compose() {
  for (var _len = arguments.length, fns = new Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  return function (x) {
    return fns.reduceRight(function (y, f) {
      return f(y);
    }, x);
  };
}

function curry(fn) {
  return function curried() {
    var _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return args.length >= fn.length ? fn.apply(this, args) : function () {
      for (var _len3 = arguments.length, nextArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        nextArgs[_key3] = arguments[_key3];
      }

      return curried.apply(_this, [].concat(args, nextArgs));
    };
  };
}

function isObject(value) {
  return {}.toString.call(value).includes('Object');
}

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

function isFunction(value) {
  return typeof value === 'function';
}

function hasOwnProperty(object, property) {
  return Object.prototype.hasOwnProperty.call(object, property);
}

function validateChanges(initial, changes) {
  if (!isObject(changes)) errorHandler('changeType');
  if (Object.keys(changes).some(function (field) {
    return !hasOwnProperty(initial, field);
  })) errorHandler('changeField');
  return changes;
}

function validateSelector(selector) {
  if (!isFunction(selector)) errorHandler('selectorType');
}

function validateHandler(handler) {
  if (!(isFunction(handler) || isObject(handler))) errorHandler('handlerType');
  if (isObject(handler) && Object.values(handler).some(function (_handler) {
    return !isFunction(_handler);
  })) errorHandler('handlersType');
}

function validateInitial(initial) {
  if (!initial) errorHandler('initialIsRequired');
  if (!isObject(initial)) errorHandler('initialType');
  if (isEmpty(initial)) errorHandler('initialContent');
}

function throwError(errorMessages, type) {
  throw new Error(errorMessages[type] || errorMessages["default"]);
}

var errorMessages = {
  initialIsRequired: 'initial state is required',
  initialType: 'initial state should be an object',
  initialContent: 'initial state shouldn\'t be an empty object',
  handlerType: 'handler should be an object or a function',
  handlersType: 'all handlers should be a functions',
  selectorType: 'selector should be a function',
  changeType: 'provided value of changes should be an object',
  changeField: 'it seams you want to change a field in the state which is not specified in the "initial" state',
  "default": 'an unknown error accured in `state-local` package'
};
var errorHandler = curry(throwError)(errorMessages);
var validators = {
  changes: validateChanges,
  selector: validateSelector,
  handler: validateHandler,
  initial: validateInitial
};

function create(initial) {
  var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  validators.initial(initial);
  validators.handler(handler);
  var state = {
    current: initial
  };
  var didUpdate = curry(didStateUpdate)(state, handler);
  var update = curry(updateState)(state);
  var validate = curry(validators.changes)(initial);
  var getChanges = curry(extractChanges)(state);

  function getState() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (state) {
      return state;
    };
    validators.selector(selector);
    return selector(state.current);
  }

  function setState(causedChanges) {
    compose(didUpdate, update, validate, getChanges)(causedChanges);
  }

  return [getState, setState];
}

function extractChanges(state, causedChanges) {
  return isFunction(causedChanges) ? causedChanges(state.current) : causedChanges;
}

function updateState(state, changes) {
  state.current = _objectSpread2(_objectSpread2({}, state.current), changes);
  return changes;
}

function didStateUpdate(state, handler, changes) {
  isFunction(handler) ? handler(state.current) : Object.keys(changes).forEach(function (field) {
    var _handler$field;

    return (_handler$field = handler[field]) === null || _handler$field === void 0 ? void 0 : _handler$field.call(handler, state.current[field]);
  });
  return changes;
}

var index = {
  create: create
};

module.exports = index;


/***/ })

};
;