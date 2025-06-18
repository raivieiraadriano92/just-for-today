import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

export default function IntentionFormScreen() {
  const { t } = useTranslation();

  const theme = useTheme();

  return (
    <View className="py-safe flex-1">
      <View className="border-b-hairline border-border h-16 flex-row items-center justify-start px-6">
        <InteractivePressable onPress={router.back} hitSlop={10}>
          <IconSymbol
            color={theme.colors.primary}
            name="chevron.left"
            size={24}
          />
        </InteractivePressable>
      </View>
      <View className="flex-1 gap-6 p-6">
        <View className="gap-1">
          <Text className="text-text text-3xl font-semibold leading-relaxed">
            {t("features.intention.screens.IntentionFormScreen.title")}
          </Text>
          <Text className="text-text/50 mt-1 text-base font-normal leading-relaxed">
            {t("features.intention.screens.IntentionFormScreen.description")}
          </Text>
        </View>
        <TextInput
          autoFocus
          className="text-text flex-1 text-lg font-normal"
          multiline
          placeholder={t(
            "features.intention.screens.IntentionFormScreen.placeholder",
          )}
        />
        <Button className="self-center" label={t("common.save")} />
      </View>
    </View>
  );
}
