import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<h1 className="page">Home (coming soon)</h1>} />
    </Routes>
  );
}