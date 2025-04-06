import { useLocation } from "react-router-dom";

export default function BuilderPage() {
    const location = useLocation();
    const {userPrompt} = location.state;

  return (
    <div className=""> 
    <h1>Builder page</h1>

    <p>{userPrompt}</p>

    </div>
  );
}