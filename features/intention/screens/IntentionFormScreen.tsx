import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Emitter } from "@/utils/emitter";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useTodaysIntentionStore } from "../store/todaysIntentionStore";

export default function IntentionFormScreen() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { insertTodaysIntention, todaysIntention, updateTodaysIntention } =
    useTodaysIntentionStore();

  const refIntentionValue = useRef(todaysIntention?.intention ?? "");

  const handleSave = async () => {
    if (!refIntentionValue.current) {
      return;
    }

    if (todaysIntention) {
      await updateTodaysIntention({ intention: refIntentionValue.current });
      Emitter.emit("intention:changed", { type: "update" });
    } else {
      await insertTodaysIntention({ intention: refIntentionValue.current });
      Emitter.emit("intention:changed", { type: "insert" });
    }

    router.replace("/intention/success");
  };

  return (
    <View className="flex-1">
      <View className="pt-safe bg-card">
        <View className="border-b-hairline border-border h-16 flex-row items-center justify-start px-6">
          <InteractivePressable onPress={router.back} hitSlop={10}>
            <IconSymbol
              color={theme.colors.primary}
              name="chevron.left"
              size={24}
            />
          </InteractivePressable>
        </View>
      </View>
      <KeyboardAvoidingView behavior={"padding"} className="flex-1">
        <View className="flex-1 gap-6 p-6">
          <View className="gap-1">
            <Text className="text-text text-3xl font-semibold">
              {t("features.intention.screens.IntentionFormScreen.title")}
            </Text>
            <Text className="text-text/50 text-base font-normal">
              {t("features.intention.screens.IntentionFormScreen.description")}
            </Text>
          </View>
          <View className="flex-1">
            <TextInput
              autoFocus
              className="text-text text-lg font-normal"
              defaultValue={refIntentionValue.current}
              onChangeText={(text) => (refIntentionValue.current = text)}
              placeholder={t(
                "features.intention.screens.IntentionFormScreen.placeholder",
              )}
            />
          </View>
        </View>
        <View className="border-border border-t-hairline bg-card p-6">
          <Button
            className="self-center"
            label={t("common.save")}
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
      <View className="pb-safe bg-card" />
    </View>
  );
}
