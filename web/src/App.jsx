import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Cookies from "js-cookie";
import UserLogin from "./pages/UserLogin";
import UserRegistration from "./pages/UserRegistration";
import PasswordResetRequestForm from "./components/PasswordResetRequestForm";
import ResetRequestForm from "./components/ResetRequestForm";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("SessionID"));

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/summary-dashboard" replace />
            ) : (
              <UserLogin setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route
          path="/summary-dashboard/*"
          element={
            isLoggedIn ? (
              <Dashboard setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/password/reset" element={<PasswordResetRequestForm />} />
        <Route path="/change-password" element={<ResetRequestForm/>}/>
      </Routes>
    </>
  );
};

export default App;
