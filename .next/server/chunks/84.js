exports.id = 84;
exports.ids = [84];
exports.modules = {

/***/ 87149:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 22478));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 15698));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 2195))

/***/ }),

/***/ 23920:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 31232, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 50831, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 56926, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 52987, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 44282, 23))

/***/ }),

/***/ 22478:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Providers: () => (/* binding */ Providers)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74284);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_themes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(71072);
/* __next_internal_client_entry_do_not_use__ Providers auto */ 


function Providers({ children }) {
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_auth_react__WEBPACK_IMPORTED_MODULE_1__.SessionProvider, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_themes__WEBPACK_IMPORTED_MODULE_2__/* .ThemeProvider */ .f, {
            attribute: "class",
            defaultTheme: "light",
            enableSystem: true,
            children: children
        })
    });
}


/***/ }),

/***/ 15698:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Navigation: () => (/* binding */ Navigation)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11440);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(57114);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(74284);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(51158);
/* harmony import */ var _components_ui_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(44368);
/* __next_internal_client_entry_do_not_use__ Navigation auto */ 






function Navigation() {
    const { data: session } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_4__.useSession)();
    const pathname = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.usePathname)();
    const [mobileMenuOpen, setMobileMenuOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const isActive = (path)=>pathname === path;
    const navItems = [
        {
            name: "Home",
            href: "/",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .Home */ .SK8
        },
        {
            name: "Resources",
            href: "/resources",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .BookOpen */ .p1z
        },
        {
            name: "Assessments",
            href: "/assessments",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .FileText */ .acj
        },
        {
            name: "AI Lab",
            href: "/ai-lab",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .BrainCircuit */ .N4w
        },
        {
            name: "Projects",
            href: "/projects",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .Rocket */ .w8m
        },
        {
            name: "Analytics",
            href: "/analytics",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .BarChart2 */ .kM3
        },
        {
            name: "Community",
            href: "/community",
            icon: lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .Users */ .Qaw
        }
    ];
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("nav", {
        className: "bg-white shadow-sm",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "flex justify-between h-16",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "flex",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "flex-shrink-0 flex items-center",
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                                        href: "/",
                                        className: "flex items-center",
                                        children: [
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .Lightbulb */ .vu$, {
                                                className: "h-8 w-8 text-primary"
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                className: "ml-2 text-xl font-bold text-gray-900",
                                                children: "EdPsychConnect"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "hidden sm:ml-6 sm:flex sm:space-x-4",
                                    children: navItems.map((item)=>{
                                        const Icon = item.icon;
                                        return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                                            href: item.href,
                                            className: `inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${isActive(item.href) ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"}`,
                                            children: [
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Icon, {
                                                    className: "mr-1.5 h-5 w-5"
                                                }),
                                                item.name
                                            ]
                                        }, item.name);
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "hidden sm:ml-6 sm:flex sm:items-center",
                            children: session ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "text-sm text-gray-700",
                                        children: session.user?.name || session.user?.email
                                    }),
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ui_button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                        variant: "ghost",
                                        size: "sm",
                                        onClick: ()=>(0,next_auth_react__WEBPACK_IMPORTED_MODULE_4__.signOut)(),
                                        className: "text-gray-600",
                                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .LogOut */ .d6Z, {
                                            className: "h-5 w-5"
                                        })
                                    })
                                ]
                            }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ui_button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                onClick: ()=>(0,next_auth_react__WEBPACK_IMPORTED_MODULE_4__.signIn)(),
                                variant: "default",
                                size: "sm",
                                children: "Sign In"
                            })
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "flex items-center sm:hidden",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
                                type: "button",
                                className: "inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                                onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                        className: "sr-only",
                                        children: "Open main menu"
                                    }),
                                    mobileMenuOpen ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_6__.X, {
                                        className: "block h-6 w-6",
                                        "aria-hidden": "true"
                                    }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .Menu */ .v2r, {
                                        className: "block h-6 w-6",
                                        "aria-hidden": "true"
                                    })
                                ]
                            })
                        })
                    ]
                })
            }),
            mobileMenuOpen && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: "sm:hidden",
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "pt-2 pb-3 space-y-1",
                        children: navItems.map((item)=>{
                            const Icon = item.icon;
                            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_2___default()), {
                                href: item.href,
                                className: `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive(item.href) ? "border-primary bg-primary-50 text-primary" : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`,
                                onClick: ()=>setMobileMenuOpen(false),
                                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Icon, {
                                            className: "mr-3 h-5 w-5"
                                        }),
                                        item.name
                                    ]
                                })
                            }, item.name);
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: "pt-4 pb-3 border-t border-gray-200",
                        children: session ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "flex items-center px-4",
                            children: [
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    className: "flex-shrink-0",
                                    children: session.user?.image ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                                        className: "h-10 w-10 rounded-full",
                                        src: session.user.image,
                                        alt: session.user.name || "User"
                                    }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                        className: "h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center",
                                        children: (session.user?.name || session.user?.email || "U").charAt(0).toUpperCase()
                                    })
                                }),
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: "ml-3",
                                    children: [
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "text-base font-medium text-gray-800",
                                            children: session.user?.name
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                            className: "text-sm font-medium text-gray-500",
                                            children: session.user?.email
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ui_button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: ()=>(0,next_auth_react__WEBPACK_IMPORTED_MODULE_4__.signOut)(),
                                    className: "ml-auto text-gray-600",
                                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .LogOut */ .d6Z, {
                                        className: "h-5 w-5"
                                    })
                                })
                            ]
                        }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: "px-4",
                            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_ui_button__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .z, {
                                onClick: ()=>(0,next_auth_react__WEBPACK_IMPORTED_MODULE_4__.signIn)(),
                                variant: "default",
                                size: "sm",
                                children: "Sign In"
                            })
                        })
                    })
                ]
            })
        ]
    });
}


/***/ }),

/***/ 44368:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   z: () => (/* binding */ Button)
/* harmony export */ });
/* unused harmony export buttonVariants */
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-slot'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'class-variance-authority'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12857);
/* __next_internal_client_entry_do_not_use__ Button,buttonVariants auto */ 




const buttonVariants = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'class-variance-authority'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ react__WEBPACK_IMPORTED_MODULE_1__.forwardRef(({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-slot'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()) : "button";
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(Comp, {
        className: (0,_lib_utils__WEBPACK_IMPORTED_MODULE_3__.cn)(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    });
});
Button.displayName = "Button";



/***/ }),

/***/ 2195:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Toaster: () => (/* binding */ Toaster)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(51158);
// EXTERNAL MODULE: ./lib/utils.ts
var utils = __webpack_require__(12857);
;// CONCATENATED MODULE: ./components/ui/toast.tsx
Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'class-variance-authority'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* __next_internal_client_entry_do_not_use__ ToastProvider,ToastViewport,Toast,ToastTitle,ToastDescription,ToastClose,ToastAction auto */ 





const ToastProvider = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
const ToastViewport = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
        ref: ref,
        className: (0,utils.cn)("fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]", className),
        ...props
    }));
ToastViewport.displayName = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).displayName;
const toastVariants = Object(function webpackMissingModule() { var e = new Error("Cannot find module 'class-variance-authority'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full", {
    variants: {
        variant: {
            default: "border bg-background text-foreground",
            destructive: "destructive group border-destructive bg-destructive text-destructive-foreground"
        }
    },
    defaultVariants: {
        variant: "default"
    }
});
const Toast = /*#__PURE__*/ react_.forwardRef(({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ jsx_runtime_.jsx(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
        ref: ref,
        className: (0,utils.cn)(toastVariants({
            variant
        }), className),
        ...props
    });
});
Toast.displayName = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).displayName;
const ToastAction = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
        ref: ref,
        className: (0,utils.cn)("inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive", className),
        ...props
    }));
ToastAction.displayName = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).displayName;
const ToastClose = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
        ref: ref,
        className: (0,utils.cn)("absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600", className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react.X, {
            className: "h-4 w-4"
        })
    }));
ToastClose.displayName = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).displayName;
const ToastTitle = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
        ref: ref,
        className: (0,utils.cn)("text-sm font-semibold", className),
        ...props
    }));
ToastTitle.displayName = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).displayName;
const ToastDescription = /*#__PURE__*/ react_.forwardRef(({ className, ...props }, ref)=>/*#__PURE__*/ jsx_runtime_.jsx(Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()), {
        ref: ref,
        className: (0,utils.cn)("text-sm opacity-90", className),
        ...props
    }));
ToastDescription.displayName = Object(function webpackMissingModule() { var e = new Error("Cannot find module '@radix-ui/react-toast'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()).displayName;


// EXTERNAL MODULE: ./components/ui/use-toast.ts
var use_toast = __webpack_require__(34388);
;// CONCATENATED MODULE: ./components/ui/toaster.tsx
/* __next_internal_client_entry_do_not_use__ Toaster auto */ 


function Toaster() {
    const { toasts } = (0,use_toast/* useToast */.p)();
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(ToastProvider, {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Toast, {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ jsx_runtime_.jsx(ToastTitle, {
                                    children: title
                                }),
                                description && /*#__PURE__*/ jsx_runtime_.jsx(ToastDescription, {
                                    children: description
                                })
                            ]
                        }),
                        action,
                        /*#__PURE__*/ jsx_runtime_.jsx(ToastClose, {})
                    ]
                }, id);
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(ToastViewport, {})
        ]
    });
}


/***/ }),

/***/ 34388:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ useToast)
/* harmony export */ });
/* unused harmony export toast */
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
// Inspired by react-hot-toast library

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST"
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_VALUE;
    return count.toString();
}
const toastTimeouts = new Map();
const reducer = (state, action)=>{
    switch(action.type){
        case actionTypes.ADD_TOAST:
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case actionTypes.UPDATE_TOAST:
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case actionTypes.DISMISS_TOAST:
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    toastTimeouts.set(toastId, setTimeout(()=>{
                        toastTimeouts.delete(toastId);
                        dispatch({
                            type: actionTypes.REMOVE_TOAST,
                            toastId
                        });
                    }, TOAST_REMOVE_DELAY));
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case actionTypes.REMOVE_TOAST:
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: actionTypes.DISMISS_TOAST,
            toastId: id
        });
    dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = react__WEBPACK_IMPORTED_MODULE_0__.useState(memoryState);
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: actionTypes.DISMISS_TOAST,
                toastId
            })
    };
}



/***/ }),

/***/ 12857:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cn: () => (/* binding */ cn)
/* harmony export */ });
/* unused harmony exports formatDate, truncateString, generateId, debounce, safeJsonParse, isEmpty, capitalize */
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tailwind-merge'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());


/**
 * Combines multiple class names using clsx and tailwind-merge
 * This allows for conditional and merged Tailwind CSS classes
 */ function cn(...inputs) {
    return Object(function webpackMissingModule() { var e = new Error("Cannot find module 'tailwind-merge'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(Object(function webpackMissingModule() { var e = new Error("Cannot find module 'clsx'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(inputs));
}
/**
 * Formats a date to a readable string
 */ function formatDate(date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    }).format(date);
}
/**
 * Truncates a string to a specified length
 */ function truncateString(str, length) {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}
/**
 * Generates a random ID
 */ function generateId(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}
/**
 * Debounces a function
 */ function debounce(func, wait) {
    let timeout = null;
    return function(...args) {
        const later = ()=>{
            timeout = null;
            func(...args);
        };
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
/**
 * Safely parses JSON with error handling
 */ function safeJsonParse(json, fallback) {
    try {
        return JSON.parse(json);
    } catch (error) {
        return fallback;
    }
}
/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 */ function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim() === "";
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
}
/**
 * Capitalizes the first letter of a string
 */ function capitalize(str) {
    if (!str || typeof str !== "string") return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/***/ }),

/***/ 29850:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ RootLayout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"app\\layout.tsx","import":"Inter","arguments":[{"subsets":["latin"],"variable":"--font-inter","display":"swap"}],"variableName":"inter"}
var target_path_app_layout_tsx_import_Inter_arguments_subsets_latin_variable_font_inter_display_swap_variableName_inter_ = __webpack_require__(64135);
var target_path_app_layout_tsx_import_Inter_arguments_subsets_latin_variable_font_inter_display_swap_variableName_inter_default = /*#__PURE__*/__webpack_require__.n(target_path_app_layout_tsx_import_Inter_arguments_subsets_latin_variable_font_inter_display_swap_variableName_inter_);
// EXTERNAL MODULE: ./app/globals.css
var globals = __webpack_require__(67272);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(61363);
;// CONCATENATED MODULE: ./components/layout/Navigation.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`C:\Users\scott\Desktop\EdPsych_Tool\School_Platform\components\layout\Navigation.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;

const e0 = proxy["Navigation"];

;// CONCATENATED MODULE: ./components/ui/toaster.tsx

const toaster_proxy = (0,module_proxy.createProxy)(String.raw`C:\Users\scott\Desktop\EdPsych_Tool\School_Platform\components\ui\toaster.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: toaster_esModule, $$typeof: toaster_$$typeof } = toaster_proxy;
const toaster_default_ = toaster_proxy.default;

const toaster_e0 = toaster_proxy["Toaster"];

;// CONCATENATED MODULE: ./app/providers.tsx

const providers_proxy = (0,module_proxy.createProxy)(String.raw`C:\Users\scott\Desktop\EdPsych_Tool\School_Platform\app\providers.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: providers_esModule, $$typeof: providers_$$typeof } = providers_proxy;
const providers_default_ = providers_proxy.default;

const providers_e0 = providers_proxy["Providers"];

;// CONCATENATED MODULE: ./app/layout.tsx






const metadata = {
    title: "EdPsychConnect",
    description: "An advanced educational platform connecting educational psychologists, educators, and students"
};
function RootLayout({ children }) {
    return /*#__PURE__*/ jsx_runtime_.jsx("html", {
        lang: "en",
        className: `${(target_path_app_layout_tsx_import_Inter_arguments_subsets_latin_variable_font_inter_display_swap_variableName_inter_default()).variable}`,
        children: /*#__PURE__*/ jsx_runtime_.jsx("body", {
            className: "min-h-screen bg-gray-50",
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(providers_e0, {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(e0, {}),
                    /*#__PURE__*/ jsx_runtime_.jsx("main", {
                        className: "py-4",
                        children: children
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(toaster_e0, {})
                ]
            })
        })
    });
}


/***/ }),

/***/ 67272:
/***/ (() => {



/***/ })

};
;