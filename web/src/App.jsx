import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Cookies from "js-cookie";
import UserLogin from "./pages/UserLogin";
import UserRegistration from "./pages/UserRegistration";
import PasswordResetRequestForm from "./components/forms/PasswordResetRequestForm";
import ResetRequestForm from "./components/forms/ResetRequestForm";
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
        <Route path="/password/reset" element={<PasswordResetRequestForm isLoggedIn={isLoggedIn} />} />
        <Route path="/change-password" element={<ResetRequestForm/>}/>
      </Routes>
    </>
  );
};

export default App;
