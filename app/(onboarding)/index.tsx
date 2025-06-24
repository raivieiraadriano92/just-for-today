import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, Text, View } from "react-native";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const LOGO_SIZE = Math.min(WINDOW_WIDTH * 0.4, 200);

export default function WelcomeScreen() {
  const { t } = useTranslation();

  return (
    <View className="py-safe-offset-6 flex-1 items-center justify-center">
      <View className="flex-1 items-center justify-center gap-12">
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
        />
        <View className="max-w-sm gap-2 self-center">
          <Text className="text-center text-3xl font-bold text-text">
            {t("common.justForToday")}
          </Text>
          <Text className="text-center text-lg font-normal text-text/60">
            {t("app.welcome.welcomeMessage")}
          </Text>
        </View>
      </View>
      <Button
        label={t("app.welcome.buttonLabel")}
        onPress={() => router.push("/onboarding")}
      />
    </View>
  );
}
