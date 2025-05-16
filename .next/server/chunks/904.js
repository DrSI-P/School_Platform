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
/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(93302);






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

/***/ 93302:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ prisma)
/* harmony export */ });
// Mock Prisma client for development
// This is a temporary solution until we can get Prisma working properly
const prisma = {
    user: {
        findUnique: async (args)=>{
            console.log("Mock user findUnique called with:", args);
            // Return a mock user if email matches
            if (args?.where?.email === "mock@example.com") {
                return {
                    id: "mock-user-id",
                    name: "Mock User",
                    email: "mock@example.com",
                    password: "$2a$10$mockhashedpassword",
                    role: "user"
                };
            }
            // Return null if no user found
            return null;
        }
    },
    aiUsageLog: {
        create: async (data)=>{
            console.log("Mock AI usage log created:", data);
            return {
                id: "mock-log-id",
                ...data.data,
                createdAt: new Date()
            };
        }
    },
    aiLabSession: {
        create: async (data)=>{
            console.log("Mock AI lab session created:", data);
            return {
                id: "mock-session-id",
                ...data.data,
                createdAt: new Date(),
                updatedAt: new Date(),
                codeSnippets: [],
                aiModels: []
            };
        },
        update: async (data)=>{
            console.log("Mock AI lab session updated:", data);
            return {
                id: data.where.id,
                ...data.data,
                userId: data.where.userId,
                updatedAt: new Date(),
                codeSnippets: [],
                aiModels: []
            };
        },
        findMany: async (args)=>{
            console.log("Mock AI lab session findMany called with:", args);
            return [
                {
                    id: "mock-session-id-1",
                    title: "Mock Session 1",
                    description: "Mock session description",
                    duration: 0,
                    userId: args.where.userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    codeSnippets: [],
                    aiModels: []
                }
            ];
        },
        findUnique: async (args)=>{
            console.log("Mock AI lab session findUnique called with:", args);
            if (args.where.id === "mock-session-id-1") {
                return {
                    id: "mock-session-id-1",
                    title: "Mock Session 1",
                    description: "Mock session description",
                    duration: 0,
                    userId: args.where.userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    codeSnippets: [],
                    aiModels: []
                };
            }
            return null;
        },
        delete: async (args)=>{
            console.log("Mock AI lab session delete called with:", args);
            return {
                id: args.where.id,
                title: "Deleted Session",
                description: "This session has been deleted",
                duration: 0,
                userId: args.where.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        }
    },
    aIModel: {
        findFirst: async (args)=>{
            console.log("Mock AI model findFirst called with:", args);
            if (args.where.name === "gpt-4") {
                return {
                    id: "mock-model-id-gpt4",
                    name: "gpt-4",
                    provider: "OPENAI",
                    type: "TEXT",
                    description: "GPT-4 AI model"
                };
            }
            return null;
        },
        create: async (data)=>{
            console.log("Mock AI model created:", data);
            return {
                id: `mock-model-id-${data.data.name.replace(/[^a-zA-Z0-9]/g, "")}`,
                ...data.data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        }
    }
};


/***/ })

};
;