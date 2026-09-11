import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "./features/auth/AuthPage";
import { Landing } from "./features/landing/Landing";
import { ProtectedLayout } from "./app/ProtectedLayout";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/*" element={<ProtectedLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
