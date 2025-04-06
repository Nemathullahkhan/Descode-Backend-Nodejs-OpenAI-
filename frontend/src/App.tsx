import { Route, Routes } from "react-router-dom";
import BuilderPage from "./pages/Builder";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
    </>
  );
}
