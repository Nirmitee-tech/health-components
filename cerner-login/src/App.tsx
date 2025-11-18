// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CernerLoginButton from "./components/CernerLoginButton";
import CernerCallback from "./pages/CernerCallback";
import ThankYou from "./pages/ThankYou";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CernerLoginButton />} />
        <Route path="/callback" element={<CernerCallback />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
