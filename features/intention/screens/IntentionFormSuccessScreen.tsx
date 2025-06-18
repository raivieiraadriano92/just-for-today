import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

export default function IntentionFormSuccessScreen() {
  const { t } = useTranslation();

  return (
    <>
      <View className="gap-3 p-12 pb-12">
        <Image
          className="h-12 w-12 self-center"
          source={require("@/assets/images/logo.png")}
        />
        <View className="gap-1">
          <Text className="text-text text-center text-3xl font-semibold leading-relaxed">
            {t("features.intention.screens.IntentionFormSuccessScreen.title")}
          </Text>
          <Text className="text-text/50 mt-1 text-center text-base font-normal leading-relaxed">
            {t(
              "features.intention.screens.IntentionFormSuccessScreen.description",
            )}
          </Text>
        </View>
      </View>
      <View className="border-t-hairline border-border flex-row gap-6 p-6">
        <Button
          className="flex-1"
          label={t("common.notNow")}
          onPress={router.back}
        />
        <Button
          className="flex-1"
          label={t("common.yes")}
          onPress={() => {
            router.back();
            // timeout to allow the back navigation to complete and avoid flicker
            setTimeout(() => {
              router.push("/mood/new");
            }, 500);
          }}
        />
      </View>
    </>
  );
}
