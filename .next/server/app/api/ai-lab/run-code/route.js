"use strict";
(() => {
var exports = {};
exports.id = 418;
exports.ids = [418];
exports.modules = {

/***/ 4530:
/***/ ((module) => {

module.exports = require("@prisma/client/runtime/library");

/***/ }),

/***/ 67096:
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ 39491:
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ 14300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 82361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 13685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 95687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 22037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 63477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 57310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 73837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 59796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 67276:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
// EXTERNAL MODULE: ./lib/db.ts
var db = __webpack_require__(93302);
;// CONCATENATED MODULE: ./app/api/ai-lab/run-code/route.ts



// import { VM } from 'vm2' - Removing VM2 import to avoid build issues

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
        // Instead of using VM2, we'll just simulate code execution
        // This is a temporary solution until we can fix the VM2 issues
        const output = [];
        // Add some simulated output
        output.push("// Code execution simulated for development");
        output.push("// Actual code execution is disabled in this build");
        output.push(`// Your code (${code.length} characters) would run here`);
        output.push('console.log("Hello, world!");');
        output.push("Hello, world!");
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
var __webpack_exports__ = __webpack_require__.X(0, [212,236,335,904], () => (__webpack_exec__(67276)));
module.exports = __webpack_exports__;

})();