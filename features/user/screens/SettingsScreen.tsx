import { InteractivePressable } from "@/components/InteractivePressable";
import { requestReview } from "@/utils/requestReview";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import * as Application from "expo-application";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export function SettingsScreen() {
  const theme = useTheme();

  const { t } = useTranslation();

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
            {t("features.user.screens.SettingsScreen.title")}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerClassName="p-6 pb-safe-offset-6 gap-12">
        <View className="rounded-2xl bg-background px-6 dark:bg-card">
          <TouchableOpacity
            className="flex-row items-center justify-between py-6"
            onPress={() => router.push("/settings/name")}
          >
            <Text className="text-lg font-medium text-text">
              {t("features.user.screens.SettingsScreen.profile")}
            </Text>
            <Ionicons
              color={theme.colors.primary}
              name="chevron-forward"
              size={24}
            />
          </TouchableOpacity>
          <View className="border-t-hairline border-border" />
          <TouchableOpacity
            className="flex-row items-center justify-between py-6"
            onPress={() => router.push("/settings/notifications")}
          >
            <Text className="text-lg font-medium text-text">
              {t("features.user.screens.SettingsScreen.notifications")}
            </Text>
            <Ionicons
              color={theme.colors.primary}
              name="chevron-forward"
              size={24}
            />
          </TouchableOpacity>
          <View className="border-t-hairline border-border" />
          <TouchableOpacity
            className="flex-row items-center justify-between py-6"
            onPress={() => requestReview(false)}
          >
            <Text className="text-lg font-medium text-text">
              {t("features.user.screens.SettingsScreen.requestReview")}
            </Text>
            <Ionicons
              color={theme.colors.primary}
              name="chevron-forward"
              size={24}
            />
          </TouchableOpacity>
          <View className="border-t-hairline border-border" />
          <TouchableOpacity
            className="flex-row items-center justify-between py-6"
            onPress={() => router.push("/settings/language")}
          >
            <Text className="text-lg font-medium text-text">
              {t("features.user.screens.SettingsScreen.language")}
            </Text>
            <Ionicons
              color={theme.colors.primary}
              name="chevron-forward"
              size={24}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-center text-lg font-normal text-text/60 dark:text-text/80">
          {`${t("features.user.screens.SettingsScreen.version")} ${Application.nativeApplicationVersion} (${Application.nativeBuildVersion})`}
        </Text>
      </ScrollView>
    </>
  );
}
