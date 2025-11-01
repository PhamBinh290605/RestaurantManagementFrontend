import Section from "../../../components/Section";

import img_1 from "../../../assets/images/About/Img-1.jpg";
import img_2 from "../../../assets/images/About/Img2.jpg";
import img_3 from "../../../assets/images/About/Img3.jpg";
import GallerySwiper from "../../../components/GallerySwiper";
import AboutMe from "../homePage/components/AboutMe";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const listImages = [img_1, img_2, img_3];
  const { t } = useTranslation();

  return (
    <div className="bg-[#f5ebe0]">
      <AboutMe listImages={listImages} />

      <div className="relative flex justify-center items-center py-16 px-4 bg-[#f5ebe0] overflow-hidden">
        <div className="relative max-w-[900px] p-10 bg-[#fffaf0] text-[#5b2d1b] rounded-[40px] shadow-lg border border-[#d9b47c] leading-relaxed text-lg">
          <div className="absolute inset-0 rounded-[40px] border-[3px] border-transparent bg-gradient-to-tr from-[#e7c99b] to-[#f3e2c3] bg-clip-border pointer-events-none"></div>

          <div className="absolute top-0 left-0 w-24 h-24 bg-[url('/src/assets/images/leaf-pattern-top.png')] bg-no-repeat opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-[url('/src/assets/images/leaf-pattern-bottom.png')] bg-no-repeat opacity-20 rotate-180"></div>

          <div className="relative z-10">
            <p className="indent-8">{t("About.p2.p2.1")}</p>
            <p className="mt-3">{t("About.p2.p2.2")}</p>
            <p className="mt-3">{t("About.p2.p2.3")}</p>
            <p className="mt-3">{t("About.p2.p2.4")}</p>
            <p className="mt-3 italic text-center text-[#7c4b2a]">
              {t("About.p2.p2.5")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
