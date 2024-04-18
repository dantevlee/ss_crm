import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import "./App.css";
import UserLogin from "./components/pages/UserLogin";
import UserRegistration from "./components/pages/UserRegistration";

const App = () => {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<UserLogin/>}></Route>
          <Route path="/summary" element={<Dashboard />}></Route>
          <Route path="/register" element={<UserRegistration />}> </Route>
        </Routes>
      </div>
    </>
  );
};

export default App;
