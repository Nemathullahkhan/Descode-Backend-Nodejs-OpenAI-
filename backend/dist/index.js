"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const nextjs_1 = require("./defaults/nextjs");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("dotenv").config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is in your .env
});
``;
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const prompt = req.body.prompt;
    const response = yield openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0,
        max_tokens: 10,
        messages: [
            {
                role: "system",
                content: "Return Either node or react or nextjs template code. Do not return anything else. Do not return any explanations or comments. Just the single word node or react or nextjs. IMPORTANT: if you get confused b/w react or nextjs always return react\n\n",
            },
            { role: "user", content: prompt },
        ],
    });
    const answer = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.toLowerCase();
    if (answer == "react") {
        res.json({
            answer: answer,
            prompts: [
                prompts_1.DEFAULT_PROMPT,
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [react_1.basePrompt],
        });
        return;
    }
    if (answer === "node") {
        res.json({
            answer: answer,
            prompts: [
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [node_1.basePrompt],
        });
        return;
    }
    if (answer === "nextjs") {
        res.json({
            answer: answer,
            prompts: [
                prompts_1.DEFAULT_PROMPT,
                `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nextjs_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
            ],
            uiPrompts: [nextjs_1.basePrompt],
        });
        return;
    }
    res.status(403).json({ message: "You can't access this!" });
    return;
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const messages = req.body.messages;
    const response = yield openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 8000,
        messages: [{
                role: "system",
                content: (0, prompts_1.getSystemPrompt)()
            },
            ...messages
        ]
    });
    const data = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
    console.log(data);
}));
// async function main() {
//   const nextjsBasePrompt = basePrompt;
//   const stream = await openai.chat.completions.create({
//     model: "gpt-4o",
//     temperature: 0,
//     max_tokens: 5000,
//     messages: [
//       { role: "system", content: getSystemPrompt() },
//       {
//         role: "user",
//         content:
//           "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n",
//       },
//       {
//         role: "user",
//         content: `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nextjsBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
//       },
//       {
//         role: "user",
//         content: "create a todo application",
//       },
//       { role: "user", content: "Create a todo app in nextjs with ts" },
//     ],
//     stream: true,
//   });
//   for await (const chunk of stream) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || "");
//   }
// }
// main();
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
