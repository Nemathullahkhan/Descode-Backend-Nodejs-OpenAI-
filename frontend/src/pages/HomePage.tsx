import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";

export default function HomePage() {
  const [userPrompt, setUserPrompt] = useState<string>("");
  const router = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
        const response = await axios.post(`${BACKEND_URL}/template`, {
            prompt: userPrompt.trim(),
        });
        
        router("/builder", { state: { userPrompt}  });
    } catch(error){
        console.log("API ERROR",error);
    }

  };

  return (
    <div className="max-w-7xl items-center">
      <div className="mx-10 mt-10 flex flex-col justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex mx-10 border-2 border-zinc-400 "
        >
          <Textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="!bg-transparent border-0 w-full focus-visible:ring-0 focus-visible:ring-offset-0 !text-md"
          />
          <Button type="submit" onClick= {()=> console.log("button clicked")}>
            {" "}
            <SendIcon />{" "}
          </Button>
        </form>
      </div>
    </div>
  );
}
