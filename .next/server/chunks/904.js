"use strict";
exports.id = 904;
exports.ids = [904];
exports.modules = {

/***/ 35904:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GET: () => (/* binding */ handler),
/* harmony export */   POST: () => (/* binding */ handler),
/* harmony export */   authOptions: () => (/* binding */ authOptions)
/* harmony export */ });
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49861);
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(27181);
/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(42446);
/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(51989);
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(67096);
/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(25007);






// @ts-ignore - Ignore the type incompatibility between @auth/prisma-adapter and next-auth
const authOptions = {
    adapter: (0,_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__/* .PrismaAdapter */ .N)(_lib_db__WEBPACK_IMPORTED_MODULE_5__/* .prisma */ ._),
    providers: [
        (0,next_auth_providers_google__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z)({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const user = await _lib_db__WEBPACK_IMPORTED_MODULE_5__/* .prisma */ ._.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!user || !user.password) {
                    return null;
                }
                const isPasswordValid = await (0,bcrypt__WEBPACK_IMPORTED_MODULE_4__.compare)(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                };
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
        newUser: "/auth/new-user"
    },
    secret: process.env.NEXTAUTH_SECRET
};
const handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions);



/***/ }),

/***/ 25007:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ prisma)
/* harmony export */ });
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(53524);
/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices
const globalForPrisma = global;
const prisma = globalForPrisma.prisma || new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({
    log:  false ? 0 : [
        "error"
    ]
});
if (false) {}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (prisma)));


/***/ })

};
;