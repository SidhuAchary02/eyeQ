import { Routes, Route } from "react-router-dom";
import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AppRoutes;
