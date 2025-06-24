import { InteractivePressable } from "@/components/InteractivePressable";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@react-navigation/native";
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
            <IconSymbol
              color={theme.colors.primary}
              name="chevron.left"
              size={24}
            />
          </InteractivePressable>
          <Text className="absolute text-lg font-semibold text-text">
            {t("features.user.screens.SettingsScreen.title")}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerClassName="p-6 pb-safe-offset-6">
        <View className="rounded-2xl bg-background px-6 dark:bg-card">
          <TouchableOpacity
            className="flex-row items-center justify-between py-6"
            onPress={() => router.push("/settings/name")}
          >
            <Text className="text-lg font-medium text-text">
              {t("features.user.screens.SettingsScreen.profile")}
            </Text>
            <IconSymbol
              color={theme.colors.primary}
              name="chevron.right"
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
            <IconSymbol
              color={theme.colors.primary}
              name="chevron.right"
              size={24}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
