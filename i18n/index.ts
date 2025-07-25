import { reloadWidgets, setWidgetLanguage } from "@/utils/widgets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEn from "./locales/en/translation.json";
import translationPt from "./locales/pt/translation.json";

const resources = {
  pt: { translation: translationPt },
  en: { translation: translationEn },
  // es: { translation: translationEs },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = getLocales()[0].languageCode;

    if (savedLanguage) {
      setLanguageInStorage(savedLanguage);
    }
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

const setLanguageInStorage = async (language: string) => {
  try {
    await AsyncStorage.setItem("language", language);
    setWidgetLanguage(language);
    reloadWidgets();
  } catch (error) {
    console.error("Failed to update widget storage:", error);
  }
};

export const setLanguage = async (language: string) => {
  i18n.changeLanguage(language);

  setLanguageInStorage(language);
};

export default i18n;
