import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "./components/Authguard";
import WelcomePage from "./pages/Welcomepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PinEntry from "./pages/Pinentry";
import Dashboard from "./dashboard/Dashboard";
import AdminChat from "./components/chat/Adninchat";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public route — anyone can visit ── */}
        <Route path="/" element={<WelcomePage />} />

        {/* ── Guest-only routes — logged-in users are redirected to /pin ── */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* ── Protected routes — must be logged in ── */}
        <Route path="/pin"       element={<ProtectedRoute><PinEntry /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/chat" element={<AdminChat />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;