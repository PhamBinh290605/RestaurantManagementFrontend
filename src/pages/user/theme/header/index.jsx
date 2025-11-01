import { useTranslation } from "react-i18next";
import { ROUTERS } from "../../../../utils/router";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const { t, i18n } = useTranslation("header");
  const navigate = useNavigate();
  const menuItems = [
    { path: ROUTERS.USER.ABOUT, name: t("Menu.about") },
    { path: ROUTERS.USER.MENU, name: t("Menu.menu") },
    { path: ROUTERS.USER.RESERVATION, name: t("Menu.booking") },
    { path: ROUTERS.USER.ALBUM, name: t("Menu.album") },
    { path: ROUTERS.USER.CONTACT, name: t("Menu.contact") },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === "vi" ? "en" : "vi";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  return (
    <header className="bg-[#6B4A3A] text-[#F5E6C8] shadow-md border-b-[3px] border-[#D2B48C] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-3 md:py-4">
        <div
          onClick={() => navigate(ROUTERS.USER.HOME)}
          className="flex items-center gap-3"
        >
          <div className="relative group">
            <svg
              width="70"
              height="70"
              viewBox="0 0 110 110"
              className="w-14 h-14 md:w-16 md:h-16 transition-transform duration-300 group-hover:scale-105"
              style={{
                filter:
                  "drop-shadow(0 0 6px rgba(255,210,100,0.8)) drop-shadow(0 0 12px rgba(255,190,60,0.4))",
              }}
            >
              <text
                x="55"
                y="70"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="50"
                fontWeight="bold"
                fill="#F1D8A1"
                textAnchor="middle"
                letterSpacing="-0.5"
                style={{
                  paintOrder: "stroke fill",
                  stroke: "#D4A574",
                  strokeWidth: "1.8",
                }}
              >
                BTM
              </text>

              <g transform="translate(20, 26) scale(0.92)">
                <path
                  d="M 18 0 Q 18 12, 23 18 Q 28 24, 23 30 Q 18 36, 18 45"
                  stroke="#D4A574"
                  strokeWidth="2.9"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 23 0 Q 23 12, 28 18 Q 33 24, 28 30 Q 23 36, 23 45"
                  stroke="#D4A574"
                  strokeWidth="2.9"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 28 0 Q 28 12, 33 18 Q 38 24, 33 30 Q 28 36, 28 45"
                  stroke="#D4A574"
                  strokeWidth="2.9"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="23" cy="45" r="5.8" fill="#D4A574" />
                <path
                  d="M 23 51 Q 23 57, 18 63 Q 13 69, 18 74"
                  stroke="#D4A574"
                  strokeWidth="3.3"
                  fill="none"
                  strokeLinecap="round"
                />
              </g>

              <g transform="translate(73, 34) scale(0.87) rotate(-28)">
                <ellipse cx="12" cy="8" rx="9.5" ry="7.5" fill="#E8C39E" />
                <rect
                  x="8"
                  y="12"
                  width="8"
                  height="33"
                  rx="4"
                  fill="#D4A574"
                />
                <circle cx="12" cy="47" r="6.8" fill="#E8C39E" />
              </g>
            </svg>
          </div>

          {/* Ẩn để giữ layout */}
          <h1 className="text-xl md:text-2xl font-semibold font-serif tracking-wider text-[#F1D8A1] opacity-0">
            BTM Restaurant
          </h1>
        </div>

        {/* Navigation - Dùng NavLink để active */}
        <nav className="hidden md:flex items-center gap-8 font-semibold tracking-wide uppercase text-sm">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `cursor-pointer relative group transition-all duration-300 ${
                  isActive ? "text-[#F1D8A1]" : "hover:text-[#F1D8A1]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-[#F1D8A1] transition-all duration-300 ease-in-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Search + EN button */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder={t("Search")}
            className="bg-[#D2B48C] text-[#4B2E05] placeholder-[#5C3A21] px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EAC47D] text-sm w-28 md:w-40 transition-all"
          />
          <button
            onClick={toggleLanguage}
            className="bg-transparent border border-[#D2B48C] text-[#F5E6C8] px-2 py-1 rounded-md hover:bg-[#D2B48C] hover:text-[#4B2E05] transition-all duration-300 text-sm font-bold"
          >
            {i18n.language === "vi" ? "EN" : "VI"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
