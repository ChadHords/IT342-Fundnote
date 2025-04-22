import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Overview from "./pages/Overview";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Accounts from "./pages/Accounts";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";

const Layout = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/', '/login', '/signup'];
  const isSidebarVisible = !hideSidebarRoutes.includes(location.pathname);

  return (
    <>
      {isSidebarVisible && <Sidebar />}
      <div style={{ flexGrow: 1, marginLeft: isSidebarVisible ? '240px' : '0' }}>
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
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
