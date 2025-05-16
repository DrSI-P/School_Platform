"use strict";
(() => {
var exports = {};
exports.id = 289;
exports.ids = [289];
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

/***/ 57147:
/***/ ((module) => {

module.exports = require("fs");

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

/***/ 71017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 63477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 12781:
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ 76224:
/***/ ((module) => {

module.exports = require("tty");

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

/***/ 71835:
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

// NAMESPACE OBJECT: ./app/api/ai-lab/assistant/route.ts
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
// EXTERNAL MODULE: ./node_modules/openai/dist/index.js
var dist = __webpack_require__(31980);
;// CONCATENATED MODULE: ./lib/ai/openai-service.ts

// Initialize OpenAI client
const configuration = new dist.Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new dist.OpenAIApi(configuration);
// OpenAI Service class for more structured usage
class OpenAIService {
    constructor(apiKey){
        const config = new dist.Configuration({
            apiKey: apiKey || process.env.OPENAI_API_KEY
        });
        this.client = new dist.OpenAIApi(config);
    }
    async getChatCompletion(messages, options = {}) {
        try {
            const response = await this.client.createChatCompletion({
                model: options.model || process.env.OPENAI_API_MODEL || "gpt-4",
                messages: messages,
                temperature: options.temperature || 0.7,
                max_tokens: options.max_tokens || 1500,
                top_p: options.top_p || 1,
                frequency_penalty: options.frequency_penalty || 0,
                presence_penalty: options.presence_penalty || 0
            });
            return {
                content: response.data.choices[0].message?.content,
                usage: response.data.usage
            };
        } catch (error) {
            console.error("OpenAI API error:", error);
            throw new Error("Failed to get chat completion");
        }
    }
    async generateEmbedding(text) {
        try {
            const response = await this.client.createEmbedding({
                model: "text-embedding-ada-002",
                input: text
            });
            return {
                embedding: response.data.data[0].embedding,
                usage: response.data.usage
            };
        } catch (error) {
            console.error("OpenAI API error:", error);
            throw new Error("Failed to generate embedding");
        }
    }
    async moderateContent(text) {
        try {
            const response = await this.client.createModeration({
                input: text
            });
            return {
                flagged: response.data.results[0].flagged,
                categories: response.data.results[0].categories,
                scores: response.data.results[0].category_scores
            };
        } catch (error) {
            console.error("OpenAI API error:", error);
            throw new Error("Failed to moderate content");
        }
    }
}
// Standalone functions for simpler usage
async function generateContent(prompt, options = {}) {
    try {
        const response = await openai.createChatCompletion({
            model: process.env.OPENAI_API_MODEL || "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert educational content creator providing high-quality, accurate educational materials tailored to student needs."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1500
        });
        return {
            content: response.data.choices[0].message?.content,
            usage: response.data.usage
        };
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw new Error("Failed to generate content");
    }
}
async function analyzeStudentResponse(question, studentResponse, gradeLevel, subject) {
    try {
        const prompt = `
    As an educational assessment expert, analyze this student response:
    
    Question: ${question}
    
    Student Response: ${studentResponse}
    
    This is for a ${gradeLevel} level ${subject} assessment.
    
    Provide:
    1. Accuracy analysis
    2. Conceptual understanding
    3. Strengths demonstrated
    4. Areas for improvement
    5. Suggested follow-up activities
    `;
        const response = await openai.createChatCompletion({
            model: process.env.OPENAI_API_MODEL || "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert educational assessor providing thoughtful, accurate, and constructive feedback on student work."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.5
        });
        return {
            analysis: response.data.choices[0].message?.content,
            usage: response.data.usage
        };
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw new Error("Failed to analyze student response");
    }
}
async function generateLessonPlan(subject, topic, gradeLevel, learningObjectives, differentiation = true) {
    try {
        const prompt = `
    Create a detailed lesson plan for teaching ${topic} in ${subject} for ${gradeLevel} students.
    
    Learning Objectives: ${learningObjectives.join(", ")}
    
    Include:
    - Introduction/hook
    - Main activities with timing
    - Assessment strategies
    - Materials needed
    - Closure activities
    ${differentiation ? "- Differentiation strategies for various learning needs" : ""}
    - Extensions and homework options
    `;
        const response = await openai.createChatCompletion({
            model: process.env.OPENAI_API_MODEL || "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert curriculum developer creating comprehensive, engaging, and effective lesson plans for educators."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        });
        return {
            lessonPlan: response.data.choices[0].message?.content,
            usage: response.data.usage
        };
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw new Error("Failed to generate lesson plan");
    }
}
async function personalizeContent(content, learnerProfile) {
    try {
        const prompt = `
    Adapt the following educational content for a learner with these characteristics:
    
    Learning Style: ${JSON.stringify(learnerProfile.learningStyle)}
    Strengths: ${learnerProfile.strengths.join(", ")}
    Challenges: ${learnerProfile.challenges.join(", ")}
    Interests: ${learnerProfile.interests.join(", ")}
    
    Original Content:
    ${content}
    
    Adapt this content to better engage this learner while maintaining educational integrity. Consider their learning style, build on their strengths, provide support for challenges, and connect to their interests where appropriate.
    `;
        const response = await openai.createChatCompletion({
            model: process.env.OPENAI_API_MODEL || "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert in differentiated instruction and personalized learning, skilled at adapting educational materials to individual needs while maintaining quality and rigor."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7
        });
        return {
            personalizedContent: response.data.choices[0].message?.content,
            usage: response.data.usage
        };
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw new Error("Failed to personalize content");
    }
}

// EXTERNAL MODULE: ./lib/db.ts
var db = __webpack_require__(93302);
;// CONCATENATED MODULE: ./app/api/ai-lab/assistant/route.ts





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
        const { messages, code, model } = await request.json();
        // Validate request
        if (!messages || !Array.isArray(messages)) {
            return next_response/* default */.Z.json({
                error: "Invalid request: messages array is required"
            }, {
                status: 400
            });
        }
        // Create system message with context
        const systemMessage = {
            role: "system",
            content: `You are an AI coding assistant in an educational platform called EdPsychConnect. 
      You help students learn to code and build AI-powered tools for education.
      
      When providing code examples, use markdown code blocks with the appropriate language tag.
      For example: \`\`\`javascript
      // Your code here
      \`\`\`
      
      Be concise, helpful, and focus on teaching good coding practices.
      If the user shares code with you, analyze it and provide constructive feedback.
      
      Current code context:
      \`\`\`javascript
      ${code || "No code provided"}
      \`\`\`
      `
        };
        // Get response from OpenAI
        const openai = new OpenAIService();
        const aiResponse = await openai.getChatCompletion([
            systemMessage,
            ...messages
        ], {
            model: model || process.env.OPENAI_API_MODEL || "gpt-4o",
            temperature: 0.7,
            max_tokens: 2000
        });
        // Log AI usage
        await db/* prisma */._.aiUsageLog.create({
            data: {
                type: "AI_LAB_ASSISTANT",
                prompt: JSON.stringify(messages),
                tokensUsed: aiResponse.usage?.total_tokens || 0,
                userId: session.user.id
            }
        });
        return next_response/* default */.Z.json({
            response: aiResponse.content
        });
    } catch (error) {
        console.error("AI Lab Assistant error:", error);
        return next_response/* default */.Z.json({
            error: "Failed to get response from AI assistant"
        }, {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fai-lab%2Fassistant%2Froute&name=app%2Fapi%2Fai-lab%2Fassistant%2Froute&pagePath=private-next-app-dir%2Fapi%2Fai-lab%2Fassistant%2Froute.ts&appDir=C%3A%5CUsers%5Cscott%5CDesktop%5CEdPsych_Tool%5CSchool_Platform%5Capp&appPaths=%2Fapi%2Fai-lab%2Fassistant%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

    

    

    

    const options = {"definition":{"kind":"APP_ROUTE","page":"/api/ai-lab/assistant/route","pathname":"/api/ai-lab/assistant","filename":"route","bundlePath":"app/api/ai-lab/assistant/route"},"resolvedPagePath":"C:\\Users\\scott\\Desktop\\EdPsych_Tool\\School_Platform\\app\\api\\ai-lab\\assistant\\route.ts","nextConfigOutput":""}
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

    const originalPathname = "/api/ai-lab/assistant/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [212,236,335,980,904], () => (__webpack_exec__(71835)));
module.exports = __webpack_exports__;

})();