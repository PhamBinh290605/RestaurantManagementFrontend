import { useTranslation } from "react-i18next";
import GallerySwiper from "../../../../components/GallerySwiper";
import Section from "../../../../components/Section";

const AboutMe = (props) => {
  const { listImages } = props;
  const { t } = useTranslation();

  return (
    <>
      <Section title={t("Home.section.s1")} />
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 px-6 py-16">
        <div className="text-[#5b2d1b] md:w-1/2 space-y-4">
          <h3 className="text-3xl font-bold mb-4 tracking-wide">
            {t("Home.p1.title")}
          </h3>
          <p className="text-lg font-medium uppercase tracking-wide text-[#a56b48]">
            {t("Home.p1.p1.1")}
          </p>
          <p className="leading-relaxed">{t("Home.p1.p1.2")}</p>
          <p className="leading-relaxed">{t("Home.p1.p1.3")}</p>
          <p className="leading-relaxed">{t("Home.p1.p1.4")}</p>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <GallerySwiper images={listImages} />
        </div>
      </div>
    </>
  );
};

export default AboutMe;
