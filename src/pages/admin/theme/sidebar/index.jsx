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
  Archive,
  User,
  UserCog,
  UserCheck,
  UserX,
} from "lucide-react";
import { ROUTERS } from "../../../../utils/router";
import { useAuth } from "../../../../components/context/authContext";
import { useState } from "react";

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [openSubmenu, setOpenSubmenu] = useState(null);

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
            icon: <Utensils size={20} />,
            submenu: true,
            children: [
              {
                name: "Create Menu",
                path: ROUTERS.ADMIN.MENU_MANAGEMENT,
                icon: <Utensils size={16} />,
                active: location.pathname.includes("/menu-management"),
              },
              {
                name: "Category Management",
                path: ROUTERS.ADMIN.CATEGORY_MANAGEMENT,
                icon: <Archive size={20} />,
                active: location.pathname.includes("/category-management"),
              },
            ],
          },
          {
            name: "Table",
            path: ROUTERS.ADMIN.TABLE,
            icon: <Table2 size={20} />,
          },
          {
            name: "Inventory",
            icon: <Boxes size={20} />, // Icon chính cho mục cha
            submenu: true, // Đánh dấu đây là một submenu
            children: [ // Thêm các mục con
              {
                name: "List Inventory", // Đây là link "Inventory" gốc
                path: ROUTERS.ADMIN.INVENTORY_LIST,
                icon: <Boxes size={16} />, // Dùng icon nhỏ hơn cho mục con
                active: location.pathname.includes("/inventory/list"),
              },
              {
                name: "Create Inventory",
                path: ROUTERS.ADMIN.INVENTORY_CREATE, //* Xem lưu ý bên dưới
                icon: <Archive size={16} />, // Tận dụng icon đã import
                active: location.pathname.includes("/inventory/create"), //* Xem lưu ý bên dưới
              },
              {
                name: "Add Item",
                path: ROUTERS.ADMIN.INVENTORY_ADD_ITEM, //* Xem lưu ý bên dưới
                icon: <UserCheck size={16} />, // Tận dụng icon "thêm mới"
                active: location.pathname.includes("/inventory/add-item"), //* Xem lưu ý bên dưới
              },
            ],
          },
          // STAFF SUBMENU
          {
            name: "Staff",
            icon: <Users size={20} />,
            submenu: true,
            children: [
              {
                name: "List Staff",
                path: ROUTERS.ADMIN.STAFF,
                icon: <User size={16} />,
                active: location.pathname.includes("/staffs"),
              },
              {
                name: "Shift Assignments",
                path: ROUTERS.ADMIN.STAFF_SHIFT_ASSIGNMENTS,
                icon: <UserCog size={16} />,
                active: location.pathname.includes("/staff/shift-assignments"),
              },
              {
                name: "Add new",
                path: ROUTERS.ADMIN.STAFF_ADD,
                icon: <UserCheck size={16} />,
                active: location.pathname.includes("/staff/addNew"),
              },
            ],
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
            icon: <Boxes size={20} />, // Icon chính cho mục cha
            submenu: true, // Đánh dấu đây là một submenu
            children: [ // Thêm các mục con
              {
                name: "List Inventory", // Đây là link "Inventory" gốc
                path: ROUTERS.ADMIN.INVENTORY,
                icon: <Boxes size={16} />, // Dùng icon nhỏ hơn cho mục con
                active: location.pathname === ROUTERS.ADMIN.INVENTORY,
              },
              {
                name: "Create Inventory",
                path: ROUTERS.ADMIN.INVENTORY_CREATE, //* Xem lưu ý bên dưới
                icon: <Archive size={16} />, // Tận dụng icon đã import
                active: location.pathname.includes("/inventory/create"), //* Xem lưu ý bên dưới
              },
              {
                name: "Add Item",
                path: ROUTERS.ADMIN.INVENTORY_ADD_ITEM, //* Xem lưu ý bên dưới
                icon: <UserCheck size={16} />, // Tận dụng icon "thêm mới"
                active: location.pathname.includes("/inventory/add-item"), //* Xem lưu ý bên dưới
              },
            ],
          },
          {
            name: "Staff",
            icon: <Users size={20} />,
            submenu: true,
            children: [
              {
                name: "Register Shifts",
                path: ROUTERS.ADMIN.STAFF_REGISTER_SHIFTS,
                icon: <UserX size={16} />,
                active: location.pathname.includes("staff/register-shift"),
              },
              {
                name: "Check in/out",
                path: ROUTERS.ADMIN.STAFF_ATTEND_ASSIGNMENT,
                icon: <UserX size={16} />,
                active: location.pathname.includes("/staff/attend-assignment"),
              },
            ],
          },
          {
            name: "Setting",
            path: ROUTERS.ADMIN.SETTING,
            icon: <Settings size={20} />,
          },
        ]
      : []),
  ];

  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const handleMenuClick = (item, index) => {
    if (item.path) {
      navigate(item.path);
    } else if (item.submenu) {
      toggleSubmenu(index);
    }
  };

  const renderMenuItem = (item, index) => {
    const isActive = item.path ? location.pathname === item.path : false;
    const hasActiveSubmenu =
      item.children?.some((child) => child.active) || false;
    const isOpen = openSubmenu === index;

    return (
      <div key={index} className="mb-1">
        {/* Main Menu Item */}
        <div
          onClick={() => handleMenuClick(item, index)}
          className={`flex items-center gap-3 px-8 py-3 cursor-pointer font-medium transition-all duration-300 group relative overflow-hidden ${
            isActive || hasActiveSubmenu
              ? "bg-gradient-to-r from-[#E8F3F2] to-[#D9EFEE] text-[#4A7B7A] border-l-4 border-[#4A7B7A] font-semibold shadow-sm"
              : "text-gray-700 hover:bg-gray-50/80 hover:text-[#4A7B7A] hover:shadow-sm"
          }`}
        >
          <div
            className={`transition-all duration-300 flex-shrink-0 ${
              isActive || hasActiveSubmenu
                ? "scale-110"
                : "group-hover:scale-110"
            }`}
          >
            {item.icon}
          </div>

          {!collapsed && (
            <>
              <span className="text-[15px] font-medium flex-1">
                {item.name}
              </span>

              {/* Submenu Indicator */}
              {item.submenu && !collapsed && (
                <div
                  className={`transition-transform duration-300 w-5 h-5 flex items-center justify-center rounded-full text-sm font-medium ${
                    isOpen
                      ? "bg-[#4A7B7A] text-white rotate-180"
                      : "bg-gray-200 text-gray-500 hover:bg-[#4A7B7A]/20 hover:text-[#4A7B7A]"
                  }`}
                >
                  ▼
                </div>
              )}
            </>
          )}
        </div>

        {/* Submenu */}
        {!collapsed && item.submenu && isOpen && (
          <div className="ml-10 mb-2 animate-slideDown bg-gradient-to-r from-gray-50/60 to-white/60 border-l-2 border-[#4A7B7A]/30 rounded-r-lg overflow-hidden">
            {item.children.map((subItem, subIndex) => (
              <div
                key={subIndex}
                onClick={() => navigate(subItem.path)}
                className={`flex items-center gap-3 px-6 py-2.5 cursor-pointer transition-all duration-200 group/submenu ${
                  subItem.active
                    ? "bg-white/80 text-[#4A7B7A] font-medium shadow-sm border-r-2 border-[#4A7B7A] backdrop-blur-sm"
                    : "text-gray-600 hover:bg-white/70 hover:text-[#4A7B7A] hover:shadow-sm"
                }`}
              >
                <div
                  className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                    subItem.active
                      ? "text-[#4A7B7A]"
                      : "text-gray-400 group-hover/submenu:text-[#4A7B7A]/80"
                  }`}
                >
                  {subItem.icon}
                </div>
                <span className="text-sm font-medium">{subItem.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`transition-all duration-300 bg-white border-r border-gray-200 shadow-sm flex flex-col 
        ${collapsed ? "w-[80px]" : "w-[260px]"}`}
    >
      {/* Header */}
      <div className="h-[80px] flex items-center justify-center bg-gradient-to-r from-[#4A7B7A] to-[#3A6B6A] text-white font-bold text-lg tracking-wide shadow-lg">
        {collapsed ? "SR" : "SYSTEM RESTAURANT"}
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-gray-300/60 scrollbar-track-transparent">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </nav>
    </div>
  );
};

export default Sidebar;
