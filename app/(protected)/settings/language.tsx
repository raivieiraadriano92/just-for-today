import { InteractivePressable } from "@/components/InteractivePressable";
import { setLanguage } from "@/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

export default function LanguageScreen() {
  const theme = useTheme();

  const { t, i18n } = useTranslation();

  return (
    <>
      <View className="pt-safe bg-card">
        <View className="h-16 items-center justify-center border-b-hairline border-border px-6">
          <InteractivePressable
            className="self-start"
            onPress={router.back}
            hitSlop={10}
          >
            <Ionicons
              color={theme.colors.primary}
              name="chevron-back"
              size={24}
            />
          </InteractivePressable>
          <Text className="absolute text-lg font-semibold text-text">
            {t("features.user.screens.LanguageScreen.title")}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerClassName="p-6 pb-safe-offset-6 gap-12">
        <View className="rounded-2xl bg-background px-6 dark:bg-card">
          {languages.map((language, index) => (
            <View key={language.code}>
              <TouchableOpacity
                className="flex-row items-center justify-between py-6"
                onPress={() => setLanguage(language.code)}
              >
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="text-lg font-medium text-text">
                    {language.flag}
                  </Text>
                  <Text className="text-lg font-medium text-text">
                    {language.label}
                  </Text>
                </View>
                <Ionicons
                  color={theme.colors.primary}
                  name={
                    i18n.language === language.code
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={24}
                />
              </TouchableOpacity>
              {index > 0 && (
                <View className="border-t-hairline border-border" />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
