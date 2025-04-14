import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./components/login";
import Signup from "./components/Signup";
import Overview from "./components/Overview";
import Transactions from "./components/Transactions";
import Budgets from "./components/Budgets";
import Accounts from "./components/Accounts";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";

const App = () => {
  return (
    <>
      <Router>
        <Sidebar />
        <div style={{ flexGrow: 1, padding: "24px", marginLeft: "240px" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budgets" element={<Budgets />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
