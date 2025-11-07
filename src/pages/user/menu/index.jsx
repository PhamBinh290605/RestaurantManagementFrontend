import { useTranslation } from "react-i18next";
import Section from "../../../components/Section";

const Menu = () => {
  const menuImages = [
    "KhaiVi.jpg",
    "MonChinh.jpg",
    "MonChinh_2.jpg",
    "Canh-Com.jpg",
    "MonAnKem-Lau.jpg",
    "SetMenu.jpg",
    "SetMenu-2.jpg",
    "DoUong-TrangMieng.jpg",
  ];

  const { t } = useTranslation("common");

  return (
    <div className="bg-[#f5ebe0]">
      <Section title={t("Menu")} />
      <div className="flex items-center justify-center p-6 mt-4">
        <div className="grid grid-cols-2 gap-10 w-[1200px]">
          {menuImages.map((img, i) => (
            <div
              key={i}
              className="relative rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white/70"
            >
              <img
                src={`/src/assets/images/menu/${img}`}
                alt={`Menu ${i + 1}`}
                className="w-full h-full hover:scale-102 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
