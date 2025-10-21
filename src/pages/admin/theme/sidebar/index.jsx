import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Table2,
  Boxes,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { ROUTERS } from "../../../../utils/router";
import { useAuth } from "../../../../components/context/authContext";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    ...(user.isAdmin
      ? [
          {
            name: "Dashboard",
            path: ROUTERS.ADMIN.DASHBOARD,
            icon: <LayoutDashboard size={20} />,
          },
          {
            name: "Menu Management",
            path: ROUTERS.ADMIN.MENU_MANAGEMENT,
            icon: <Utensils size={20} />,
          },
          {
            name: "Order",
            path: ROUTERS.ADMIN.ORDER,
            icon: <ShoppingBag size={20} />,
          },
          {
            name: "Table",
            path: ROUTERS.ADMIN.TABLE,
            icon: <Table2 size={20} />,
          },
          {
            name: "Inventory",
            path: ROUTERS.ADMIN.INVENTORY,
            icon: <Boxes size={20} />,
          },
          {
            name: "Staff",
            path: ROUTERS.ADMIN.STAFF,
            icon: <Users size={20} />,
          },
          {
            name: "Report",
            path: ROUTERS.ADMIN.REPORT,
            icon: <BarChart3 size={20} />,
          },
          {
            name: "Setting",
            path: ROUTERS.ADMIN.SETTING,
            icon: <Settings size={20} />,
          },
        ]
      : user.isStaff
      ? [
          {
            name: "Order",
            path: ROUTERS.ADMIN.ORDER,
            icon: <ShoppingBag size={20} />,
          },
          {
            name: "Inventory",
            path: ROUTERS.ADMIN.INVENTORY,
            icon: <Boxes size={20} />,
          },
          {
            name: "Staff",
            path: ROUTERS.ADMIN.STAFF,
            icon: <Users size={20} />,
          },
          {
            name: "Setting",
            path: ROUTERS.ADMIN.SETTING,
            icon: <Settings size={20} />,
          },
        ]
      : []),
  ];

  return (
    <div
      className={`transition-all duration-300 bg-white border-r border-gray-200 shadow-sm flex flex-col 
        ${collapsed ? "w-[80px]" : "w-[230px]"}`}
    >
      <div className="h-[80px] flex items-center justify-center bg-[#4A7B7A] text-white font-bold text-lg tracking-wide">
        {collapsed ? "SR" : "SYSTEM RESTAURANT"}
      </div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <div
              key={index}
              onClick={() => {
                navigate(item.path);
                console.log("navigating to", item.path);
                console.log("current path", location.pathname);
              }}
              className={`flex items-center gap-3 px-8 py-3 cursor-pointer font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#E8F3F2] text-[#4A7B7A] border-l-4 border-[#4A7B7A] font-semibold "
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#4A7B7A] "
              }`}
            >
              <div
                className={`transition-transform duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </div>

              {!collapsed && (
                <span className="text-[15px] font-medium">{item.name}</span>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
