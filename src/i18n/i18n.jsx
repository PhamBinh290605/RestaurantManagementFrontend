import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import các file JSON
import en_common from "./en/common.json";
import en_header from "./en/header.json";
import en_footer from "./en/footer.json";

import vi_common from "./vi/common.json";
import vi_header from "./vi/header.json";
import vi_footer from "./vi/footer.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: en_common,
      header: en_header,
      footer: en_footer,
    },
    vi: {
      common: vi_common,
      header: vi_header,
      footer: vi_footer,
    },
  },
  lng: localStorage.getItem("lang") || "vi", // ngôn ngữ mặc định
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  defaultNS: "common",
});

export default i18n;
