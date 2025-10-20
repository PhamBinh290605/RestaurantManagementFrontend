/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../header";
import Sidebar from "../sidebar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState("light");
  const handleToggleSidebar = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100  text-gray-800 transition-colors duration-300">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onToggleTheme={handleToggleSidebar}
          theme={theme}
        />
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
