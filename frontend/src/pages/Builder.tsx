"use client";
import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function BuilderPage() {
  const location = useLocation();
  const { userPrompt } = location.state;
  const [result, setResult] = useState();

  async function init() {
    try {
      const fetchData = await axios.post(`${BACKEND_URL}/template`, {
        prompt: userPrompt.trim(),
      });

      const { prompts } = await fetchData.data;

      // Make sure prompts exists before using it
      if (prompts) {
        const response = await axios.post(`${BACKEND_URL}/chat`, {
          messages: prompts.map((content) => ({
            role: "user",
            content,
          })),
        });

        setResult(response.data);
      }
    } catch (error) {
      console.error("Error in init:", error);
      // Handle the error appropriately, maybe set an error state
    }
  }

  useEffect(() => {
    init();
  });
  return (
    <div className="p-10">
      <p className="text-2xl">{userPrompt}</p>

      {/* <p className="text-green-400">{prompts}</p>

      <p>{uiPrompts}</p> */}

      <h1>{result ? JSON.stringify(result) : "Loading..."}</h1>
    </div>
  );
}
