import BannerSwiper from "../../../components/BannerSwiper";
import banner1 from "../../../assets/images/Banner/Banner-Com-ngon-scaled.jpg";
import banner2 from "../../../assets/images/Banner/Banner-Michelin-vi-an-scaled.jpg";
import Section from "../../../components/Section";

import img_1 from "../../../assets/images/About/Img-1.jpg";
import img_2 from "../../../assets/images/About/Img2.jpg";
import img_3 from "../../../assets/images/About/Img3.jpg";
import AboutMe from "./components/AboutMe";
import Cuisine from "./components/Cuisine";
import PostNew from "./components/PostNew";
import Promotion from "./components/Promotion";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const listImage = [banner1, banner2];
  const listImages = [img_1, img_2, img_3];
  return (
    <div className="min-h-screen bg-[#f5ebe0]">
      <BannerSwiper listImage={listImage} />
      <AboutMe listImages={listImages} />
      <Section title={t("Home.section.s2")} />
      <Cuisine />
      <Section title={t("Home.section.s3")} />
      <PostNew />
      <Section title={t("Home.section.s4")} />
      <Promotion />
    </div>
  );
};

export default HomePage;
