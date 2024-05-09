import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./components/pages/Dashboard";
import "./App.css";
import Cookies from "js-cookie";
import UserLogin from "./components/pages/UserLogin";
import UserRegistration from "./components/pages/UserRegistration";
import PasswordResetRequestForm from "./components/pages/PasswordResetRequestForm";
import ResetRequestForm from "./components/pages/ResetRequestForm";
import ClientPage from "./components/pages/ClientPage";


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
