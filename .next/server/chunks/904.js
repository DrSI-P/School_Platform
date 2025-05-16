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
/* harmony import */ var uuid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(79158);
// In-memory database for development
// This is a temporary solution until we can set up a proper database

// In-memory storage
const db = {
    users: new Map(),
    aiUsageLogs: new Map(),
    aiLabSessions: new Map(),
    codeSnippets: new Map(),
    aiModels: new Map()
};
// Initialize with some data
const initializeDb = ()=>{
    // Add a demo user
    const userId = (0,uuid__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
    db.users.set(userId, {
        id: userId,
        name: "Demo User",
        email: "demo@example.com",
        emailVerified: null,
        image: null,
        password: "$2a$10$mockhashedpassword",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date()
    });
    // Add a demo user with email 'mock@example.com' for compatibility
    const mockUserId = "mock-user-id";
    db.users.set(mockUserId, {
        id: mockUserId,
        name: "Mock User",
        email: "mock@example.com",
        emailVerified: null,
        image: null,
        password: "$2a$10$mockhashedpassword",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date()
    });
    // Add a default AI model
    const modelId = (0,uuid__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
    db.aiModels.set(modelId, {
        id: modelId,
        name: "gpt-4o",
        provider: "OPENAI",
        type: "TEXT",
        description: "GPT-4o AI model",
        createdAt: new Date(),
        updatedAt: new Date()
    });
    // Add a sample AI lab session
    const sessionId = "mock-session-id-1";
    db.aiLabSessions.set(sessionId, {
        id: sessionId,
        title: "Mock Session 1",
        description: "Mock session description",
        duration: 0,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date()
    });
};
// Initialize the database
initializeDb();
// Prisma-like client interface
const prisma = {
    user: {
        findUnique: async (args)=>{
            const { where } = args;
            if (where.email) {
                // Find user by email
                for (const user of Array.from(db.users.values())){
                    if (user.email === where.email) {
                        return {
                            ...user
                        };
                    }
                }
            } else if (where.id) {
                // Find user by id
                const user = db.users.get(where.id);
                if (user) {
                    return {
                        ...user
                    };
                }
            }
            return null;
        },
        create: async (args)=>{
            const { data } = args;
            const id = data.id || (0,uuid__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
            const user = {
                id,
                name: data.name,
                email: data.email,
                emailVerified: data.emailVerified || null,
                image: data.image || null,
                password: data.password || null,
                role: data.role || "user",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            db.users.set(id, user);
            return {
                ...user
            };
        }
    },
    aiUsageLog: {
        create: async (data)=>{
            const id = (0,uuid__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
            const log = {
                id,
                type: data.data.type,
                prompt: data.data.prompt,
                tokensUsed: data.data.tokensUsed,
                userId: data.data.userId,
                createdAt: new Date()
            };
            db.aiUsageLogs.set(id, log);
            return {
                ...log
            };
        }
    },
    aiLabSession: {
        create: async (data)=>{
            const id = data.id || (0,uuid__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
            const session = {
                id,
                title: data.data.title,
                description: data.data.description || null,
                duration: data.data.duration || 0,
                userId: data.data.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            db.aiLabSessions.set(id, session);
            // Handle code snippets if provided
            const codeSnippets = [];
            if (data.data.codeSnippets?.create) {
                const snippetId = (0,uuid__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
                const snippet = {
                    id: snippetId,
                    title: data.data.codeSnippets.create.title,
                    language: data.data.codeSnippets.create.language,
                    code: data.data.codeSnippets.create.code,
                    isPublic: data.data.codeSnippets.create.isPublic,
                    sessionId: id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                db.codeSnippets.set(snippetId, snippet);
                codeSnippets.push(snippet);
            }
            return {
                ...session,
                codeSnippets,
                aiModels: []
            };
        },
        update: async (data)=>{
            const { where, data: updateData } = data;
            const session = db.aiLabSessions.get(where.id);
            if (!session || session.userId !== where.userId) {
                return null;
            }
            const updatedSession = {
                ...session,
                title: updateData.title !== undefined ? updateData.title : session.title,
                description: updateData.description !== undefined ? updateData.description : session.description,
                updatedAt: new Date()
            };
            db.aiLabSessions.set(where.id, updatedSession);
            // Get code snippets for this session
            const codeSnippets = [];
            for (const snippet of Array.from(db.codeSnippets.values())){
                if (snippet.sessionId === where.id) {
                    codeSnippets.push({
                        ...snippet
                    });
                }
            }
            return {
                ...updatedSession,
                codeSnippets,
                aiModels: []
            };
        },
        findMany: async (args)=>{
            const { where } = args;
            const sessions = [];
            for (const session of Array.from(db.aiLabSessions.values())){
                if (session.userId === where.userId) {
                    sessions.push({
                        ...session
                    });
                }
            }
            // For each session, get its code snippets
            return sessions.map((session)=>{
                const codeSnippets = [];
                for (const snippet of Array.from(db.codeSnippets.values())){
                    if (snippet.sessionId === session.id) {
                        codeSnippets.push({
                            ...snippet
                        });
                    }
                }
                return {
                    ...session,
                    codeSnippets,
                    aiModels: []
                };
            });
        },
        findUnique: async (args)=>{
            const { where } = args;
            const session = db.aiLabSessions.get(where.id);
            if (!session) {
                return null;
            }
            // Get code snippets for this session
            const codeSnippets = [];
            for (const snippet of Array.from(db.codeSnippets.values())){
                if (snippet.sessionId === where.id) {
                    codeSnippets.push({
                        ...snippet
                    });
                }
            }
            return {
                ...session,
                codeSnippets,
                aiModels: []
            };
        },
        delete: async (args)=>{
            const { where } = args;
            const session = db.aiLabSessions.get(where.id);
            if (!session) {
                return null;
            }
            // Delete associated code snippets
            for (const [id, snippet] of Array.from(db.codeSnippets.entries())){
                if (snippet.sessionId === where.id) {
                    db.codeSnippets.delete(id);
                }
            }
            // Delete the session
            db.aiLabSessions.delete(where.id);
            return {
                ...session,
                updatedAt: new Date()
            };
        }
    },
    aIModel: {
        findFirst: async (args)=>{
            const { where } = args;
            if (where.name) {
                for (const model of Array.from(db.aiModels.values())){
                    if (model.name === where.name) {
                        return {
                            ...model
                        };
                    }
                }
            }
            return null;
        },
        create: async (data)=>{
            const id = (0,uuid__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)();
            const model = {
                id,
                name: data.data.name,
                provider: data.data.provider,
                type: data.data.type,
                description: data.data.description || null,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            db.aiModels.set(id, model);
            return {
                ...model
            };
        }
    }
};


/***/ })

};
;