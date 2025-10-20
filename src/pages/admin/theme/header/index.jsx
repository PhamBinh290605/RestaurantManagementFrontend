import {
  Menu,
  Search,
  ShoppingCart,
  MessageCircle,
  Moon,
  Sun,
} from "lucide-react";
import { useState } from "react";
import DropDown from "./components/dropDown";
import { useAuth } from "../../../../context/authContext";

const AdminHeader = (props) => {
  const { onToggleSidebar, onToggleTheme, theme } = props;
  const [searchValue, setSearchValue] = useState("");
  const { logout, user } = useAuth();

  return (
    <div className="flex items-center justify-between w-full h-[80px] px-6 bg-white z-10 shadow-sm transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-3 bg-[#4A7B7A] text-white rounded-md hover:bg-[#3b6564] transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center bg-gray-100  rounded-md px-3 py-2 w-[250px]">
          <Search size={18} className="text-gray-500 " />
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent outline-none ml-2 w-full text-sm text-gray-700 "
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer border border-gray-200 rounded-full p-2 hover:bg-gray-50">
          <ShoppingCart size={20} />
          <span className="absolute -top-1 -right-1 bg-[#4A7B7A] text-white text-[10px] font-semibold rounded-full px-[5px]">
            9
          </span>
        </div>

        <div className="relative cursor-pointer border border-gray-200 rounded-full p-2 hover:bg-gray-50">
          <MessageCircle size={20} />
          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-semibold rounded-full px-[5px]">
            5
          </span>
        </div>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full bg-gray-200 transition-all"
        >
          {theme === "light" ? (
            <Moon size={18} className="text-gray-800" />
          ) : (
            <Sun size={18} className="text-yellow-400" />
          )}
        </button>

        <DropDown logout={logout} user={user} />
      </div>
    </div>
  );
};

export default AdminHeader;
