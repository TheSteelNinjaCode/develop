import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./auth/Login";
import SignupPage from "./auth/SignupPage";
import Dashboard from "./dashboard/Dashboard";
import LostPassword from "./auth/LostPassword";
import Unsplash from "./dashboard/Unsplash";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/unsplash" element={<Unsplash />} />
          <Route path="/lostpassword" element={<LostPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
