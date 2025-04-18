import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login"; 
import UserSettings from "./UserSettings";
import UserProfile from "./UserProfile";
import CustomerProfile from "./CustomerProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<UserSettings />} /> {/* 🆕 Registration Page */}
        <Route path="/profile" element={<UserProfile />} />         {/* Main Profile Page */}
        <Route path="/Settings" element={<UserSettings />} />
        <Route path="/store/:username" element={<CustomerProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
