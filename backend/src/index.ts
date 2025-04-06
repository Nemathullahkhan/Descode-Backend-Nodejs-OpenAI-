import OpenAI from "openai";
import { DEFAULT_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import { basePrompt as nextBasePrompt } from "./defaults/nextjs";

import express from "express";
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is in your .env
});
``;
const app = express();
app.use(express.json());

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    max_tokens: 10,
    messages: [
      {
        role: "system",
        content:
          "Return Either node or react or nextjs template code. Do not return anything else. Do not return any explanations or comments. Just the single word node or react or nextjs. IMPORTANT: if you get confused b/w react or nextjs always return react\n\n",
      },
      { role: "user", content: prompt },
    ],
  });

  const answer = response?.choices[0]?.message?.content?.trim()?.toLowerCase();
  if (answer == "react") {
    res.json({
      answer: answer,
      prompts: [
        DEFAULT_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBasePrompt],
    });
    return;
  }

  if (answer === "node") {
    res.json({
      answer: answer,
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBasePrompt],
    });
    return;
  }

  if (answer === "nextjs") {
    res.json({
      answer: answer,
      prompts: [
        DEFAULT_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nextBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nextBasePrompt],
    });
    return;
  }
  res.status(403).json({ message: "You can't access this!" });
  return;
});

app.post("/chat",async(req,res)=>{
  const messages = req.body.messages;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens:8000,
    messages: [{
      role:"system",
      content:getSystemPrompt()
    },
    ...messages
  ]
  });
  const data = response?.choices[0]?.message?.content?.trim();
  console.log(data);
});



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
