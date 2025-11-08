import { useTranslation } from "react-i18next";
import { FaFacebookF, FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const { t } = useTranslation("footer");

  //   {
  //   "col-1": {
  //     "name": "BTM – Ăn bát cơm đầy",
  //     "address": "Cơ sở : Số 3 Cầu Giấy, Láng Thượng , Hà Nội",
  //     "p": "Nhà hàng có chỗ để xe ô tô"
  //   },
  //   "col-2": {
  //     "title": "Giờ mở cửa",
  //     "p1": "Sáng",
  //     "p2": "Chiều",
  //     "p3": "Tất cả các ngày trong tuần"
  //   },
  //   "col-3": {
  //     "title": "Mạng xã hội"
  //   },
  //   "Copy": {
  //     "p1": "Bảo mật thông tin",
  //     "p2": "Liên hệ"
  //   }
  // }
  return (
    <footer className="bg-[#6b4a3a] text-[#f1d8a1] py-10 px-6 md:px-20">
      <div className="grid md:grid-cols-3 gap-10 border-b border-[#8a6e5b] pb-10">
        <div>
          <h2 className="text-2xl font-extrabold uppercase text-[#f1d8a1]">
            {t("col-1.name")}
          </h2>
          <div className="mt-4 space-y-4 text-white">
            <div>
              <p>{t("col-1.address")}</p>
              <p>Hotline: 09999999999</p>
            </div>
            <div>
              <p>Email: nhahangbtm@gmail.com</p>
              <p>({t("col-1.p")})</p>
            </div>
          </div>
        </div>

        {/* Cột 2 */}
        <div>
          <h2 className="text-2xl font-extrabold uppercase text-[#f1d8a1]">
            {t("col-2.title")}
          </h2>
          <div className="mt-4 space-y-2 text-white">
            <p> {t("col-2.p1")}: 9h - 14h</p>
            <p>{t("col-2.p2")}: 15h - 22h</p>
            <p>{t("col-2.p3")}</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold uppercase text-[#f1d8a1]">
            {t("col-3.title")}
          </h2>
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="bg-white text-[#6b4a3a] p-3 rounded-full hover:scale-110 transition-transform"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="#"
              className="bg-white text-[#6b4a3a] p-3 rounded-full hover:scale-110 transition-transform"
            >
              <FaYoutube size={24} />
            </a>
            <a
              href="#"
              className="bg-white text-[#6b4a3a] p-3 rounded-full hover:scale-110 transition-transform"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="#"
              className="bg-white text-[#6b4a3a] p-3 rounded-full hover:scale-110 transition-transform"
            >
              <FaTiktok size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="pt-6 text-center text-white text-sm">
        <p>
          Copyright © 2025{" "}
          <span className="font-bold text-[#f1d8a1]">BTM – Ăn bát cơm đầy</span>
          . All rights reserved.
        </p>
        <div className="mt-2 flex justify-center gap-2 text-white">
          <a href="#" className="hover:underline">
            {t("Copy.p1")}
          </a>
          <div className="border-r opacity-80 h-4 mt-1"></div>
          <a href="#" className="hover:underline">
            {t("Copy.p2")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
