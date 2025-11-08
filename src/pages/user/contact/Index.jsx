import { useTranslation } from "react-i18next";
import Section from "../../../components/Section";

const Contact = () => {
  const { t } = useTranslation("common");
  return (
    <div className="min-h-screen bg-[#f5ebe0]">
      <Section title={t("Contact.section")} />
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{t("Contact.p1")}</h1>
        <p className="mb-6">{t("Contact.p2")}</p>
        <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.114408414334!2d105.80731121532585!3d21.028511985999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab40a0f063f7%3A0xe6f41b97bfb14e0f!2zSOG6u20gQ8O0bmcgTmjGoW4gVGjhu4sgVGjhu5FuZyBLaOG7m2kgxJDhu5FuZyBI4buTbmc!5e0!3m2!1sen!2s!4v1730631289052!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          ></iframe>
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Contact;
