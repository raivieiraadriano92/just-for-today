import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/features/user/store/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Platform, ScrollView, Text, View } from "react-native";
import twColors from "tailwindcss/colors";

export default function HomeWidgetScreen() {
  const { t } = useTranslation();

  const theme = useTheme();
  const { completeHomeWidgetsPresentation } = useUserStore();

  const handleCompleteHomeWidgetsPresentation = () => {
    completeHomeWidgetsPresentation();
    router.dismissAll();
  };

  return (
    <>
      <ScrollView
        contentContainerClassName="pt-safe-offset-6 p-6 gap-12"
        showsVerticalScrollIndicator={false}
      >
        <Image
          className="h-80 max-w-full"
          source={Platform.select({
            ios: require("@/assets/images/ios-home-widget.png"),
            android: require("@/assets/images/android-home-widget.png"),
          })}
          resizeMode="contain"
        />
        <View className="gap-3">
          <Text className="text-center text-3xl font-semibold text-text">
            {t("app.widgets.title")}
          </Text>
          <Text className="text-center text-lg font-normal text-text/60 dark:text-text/80">
            {t("app.widgets.description")}
          </Text>
        </View>
        <View className="gap-6 rounded-2xl bg-white p-6 dark:bg-card">
          <Text className="text-xl font-semibold text-text">
            {t("app.widgets.guide.title")}
          </Text>
          <View>
            {[
              t("app.widgets.guide.step1"),
              t("app.widgets.guide.step2"),
              t("app.widgets.guide.step3"),
              t("app.widgets.guide.step4"),
            ].map((task, index) => (
              <View key={task}>
                {!!index && (
                  <View className="ml-6 h-6 w-0.5 bg-green-500 dark:bg-green-400" />
                )}
                <View className="flex-row items-center gap-4">
                  <View className="h-12 w-12 items-center justify-center rounded-2xl border-2 border-green-500 dark:border-green-400">
                    <Ionicons
                      color={
                        theme.dark ? twColors.green[400] : twColors.green[500]
                      }
                      name="checkmark-circle"
                      size={18}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium text-text/60 dark:text-text/80">
                      {task}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="pb-safe-offset-6 border-t-hairline border-border bg-card p-6">
        <Button
          label={t("common.ok")}
          onPress={handleCompleteHomeWidgetsPresentation}
        />
      </View>
    </>
  );
}
