import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Cookies from "js-cookie";
import UserLogin from "./pages/UserLogin";
import UserRegistration from "./pages/UserRegistration";
import PasswordResetRequestForm from "./components/forms/PasswordResetRequestForm";
import ResetRequestForm from "./components/forms/ResetRequestForm";
import ClientPage from "./pages/ClientPage";
import ArchivePage from "./pages/ArchivePage";
import LeadsPage from "./pages/LeadsPage";
import MainLayout from "./pages/MainLayout";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get("SessionID"));

  return (
    <>
      <Routes>
        <Route
          path="/*"
          element={
            isLoggedIn ? (
              <MainLayout setIsLoggedIn={setIsLoggedIn}/>
            ) : (
              <UserLogin setIsLoggedIn={setIsLoggedIn} />
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
