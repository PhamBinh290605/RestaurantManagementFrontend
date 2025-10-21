import { useState, useRef } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../../../utils/router";

const DropDown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = props;

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-2 text-gray-700 font-medium">
        <div className="w-10 h-10 rounded-full bg-[#4A7B7A] flex items-center justify-center text-white font-bold">
          <img src="/src/assets/images/icon-avatar.png" alt="" />
        </div>
        <span>{user.username}</span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 
          bg-gray-50 border border-gray-200 
          rounded-lg shadow-lg py-2 z-50"
        >
          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            <User size={16} /> Profile
          </button>
          <button
            onClick={() => {
              navigate(ROUTERS.ADMIN.SETTING);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings size={16} /> Settings
          </button>
          <button
            onClick={() => {
              logout();
              navigate(ROUTERS.AUTH.LOGIN);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default DropDown;
