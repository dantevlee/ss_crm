import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import "./App.css";
import UserLogin from "./components/pages/UserLogin";
import UserRegistration from "./components/pages/UserRegistration";
import PasswordResetForm from "./components/pages/PasswordResetForm";

const App = () => {
  return (
    <>
        <Routes>
          <Route path="/" element={<UserLogin/>}></Route>
          <Route path="/summary-dashboard" element={<Dashboard />}></Route>
          <Route path="/register" element={<UserRegistration />}> </Route>
          <Route path="/password/reset" element={<PasswordResetForm/>}></Route>
        </Routes>
    </>
  );
};

export default App;
