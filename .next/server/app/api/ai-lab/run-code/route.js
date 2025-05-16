(() => {
var exports = {};
exports.id = 418;
exports.ids = [418];
exports.modules = {

/***/ 6435:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 6435;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 36837:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 36837;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 53952:
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = 53952;
module.exports = webpackEmptyContext;

/***/ }),

/***/ 53524:
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ 4530:
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client/runtime/library");

/***/ }),

/***/ 67096:
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),

/***/ 39491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 50852:
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");

/***/ }),

/***/ 14300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 32081:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 82361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 57147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 13685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 95687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 98188:
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ 22037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 71017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 63477:
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ 57310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 73837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 26144:
/***/ ((module) => {

"use strict";
module.exports = require("vm");

/***/ }),

/***/ 59796:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ 67276:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./app/api/ai-lab/run-code/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  POST: () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(42394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(69692);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(89335);
// EXTERNAL MODULE: ./node_modules/next-auth/next/index.js
var next = __webpack_require__(17185);
// EXTERNAL MODULE: ./app/api/auth/[...nextauth]/route.ts
var route = __webpack_require__(35904);
// EXTERNAL MODULE: ./node_modules/vm2/lib/main.js
var main = __webpack_require__(75846);
// EXTERNAL MODULE: ./lib/db/index.ts
var db = __webpack_require__(25007);
;// CONCATENATED MODULE: ./app/api/ai-lab/run-code/route.ts





async function POST(request) {
    // Check authentication
    const session = await (0,next.getServerSession)(route.authOptions);
    if (!session?.user) {
        return next_response/* default */.Z.json({
            error: "Authentication required"
        }, {
            status: 401
        });
    }
    try {
        const { code } = await request.json();
        // Validate request
        if (!code || typeof code !== "string") {
            return next_response/* default */.Z.json({
                error: "Invalid request: code is required"
            }, {
                status: 400
            });
        }
        // Create a sandbox environment for running the code safely
        const vm = new main.VM({
            timeout: 5000,
            sandbox: {
                console: {
                    log: (...args)=>{
                        output.push(args.map((arg)=>{
                            if (typeof arg === "object") {
                                try {
                                    return JSON.stringify(arg, null, 2);
                                } catch (e) {
                                    return String(arg);
                                }
                            }
                            return String(arg);
                        }).join(" "));
                    },
                    error: (...args)=>{
                        output.push(`Error: ${args.map((arg)=>{
                            if (typeof arg === "object") {
                                try {
                                    return JSON.stringify(arg, null, 2);
                                } catch (e) {
                                    return String(arg);
                                }
                            }
                            return String(arg);
                        }).join(" ")}`);
                    },
                    warn: (...args)=>{
                        output.push(`Warning: ${args.map((arg)=>{
                            if (typeof arg === "object") {
                                try {
                                    return JSON.stringify(arg, null, 2);
                                } catch (e) {
                                    return String(arg);
                                }
                            }
                            return String(arg);
                        }).join(" ")}`);
                    },
                    info: (...args)=>{
                        output.push(`Info: ${args.map((arg)=>{
                            if (typeof arg === "object") {
                                try {
                                    return JSON.stringify(arg, null, 2);
                                } catch (e) {
                                    return String(arg);
                                }
                            }
                            return String(arg);
                        }).join(" ")}`);
                    }
                },
                setTimeout: (callback, ms)=>{
                    if (ms > 4000) ms = 4000 // Limit setTimeout to 4 seconds
                    ;
                    return setTimeout(callback, ms);
                },
                clearTimeout: clearTimeout,
                setInterval: ()=>{
                    throw new Error("setInterval is not allowed in the sandbox");
                },
                clearInterval: ()=>{
                    throw new Error("clearInterval is not allowed in the sandbox");
                },
                // Add any other safe globals here
                Math: Math,
                Date: Date,
                JSON: JSON,
                Object: Object,
                Array: Array,
                String: String,
                Number: Number,
                Boolean: Boolean,
                Error: Error,
                RegExp: RegExp,
                Map: Map,
                Set: Set,
                Promise: Promise
            }
        });
        // Capture console output
        const output = [];
        // Run the code in the sandbox
        try {
            vm.run(code);
        } catch (error) {
            output.push(`Runtime Error: ${error.message}`);
        }
        // Log code execution
        await db/* prisma */._.aiLabSession.create({
            data: {
                title: "Code Execution",
                description: "Code executed in AI Lab",
                duration: 0,
                userId: session.user.id,
                codeSnippets: {
                    create: {
                        title: "Executed Code",
                        language: "javascript",
                        code: code,
                        isPublic: false
                    }
                }
            }
        });
        return next_response/* default */.Z.json({
            output: output.join("\n")
        });
    } catch (error) {
        console.error("Code execution error:", error);
        return next_response/* default */.Z.json({
            error: "Failed to execute code",
            details: error.message
        }, {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fai-lab%2Frun-code%2Froute&name=app%2Fapi%2Fai-lab%2Frun-code%2Froute&pagePath=private-next-app-dir%2Fapi%2Fai-lab%2Frun-code%2Froute.ts&appDir=C%3A%5CUsers%5Cscott%5CDesktop%5CEdPsych_Tool%5CSchool_Platform%5Capp&appPaths=%2Fapi%2Fai-lab%2Frun-code%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

    

    

    

    const options = {"definition":{"kind":"APP_ROUTE","page":"/api/ai-lab/run-code/route","pathname":"/api/ai-lab/run-code","filename":"route","bundlePath":"app/api/ai-lab/run-code/route"},"resolvedPagePath":"C:\\Users\\scott\\Desktop\\EdPsych_Tool\\School_Platform\\app\\api\\ai-lab\\run-code\\route.ts","nextConfigOutput":""}
    const routeModule = new (module_default())({
      ...options,
      userland: route_namespaceObject,
    })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/api/ai-lab/run-code/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [212,236,335,846,904], () => (__webpack_exec__(67276)));
module.exports = __webpack_exports__;

})();