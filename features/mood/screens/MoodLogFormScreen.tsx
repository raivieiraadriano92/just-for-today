import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import twColors from "tailwindcss/colors";

export function MoodLogFormScreen() {
  const { t } = useTranslation();

  const { id } = useLocalSearchParams<{ id: string }>();

  const theme = useTheme();

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
            <Text className="text-text text-3xl font-semibold leading-relaxed">
              How are you feeling right now?
            </Text>
            <Text className="text-text/50 text-base font-normal leading-relaxed">
              Take a moment to notice what’s present — no rush, no judgment.
            </Text>
          </View>
          <View className="flex-1 justify-center gap-4">
            {[
              {
                color: "green",
                icon: "😄",
                mood: "really_good",
              },
              {
                color: "lime",
                icon: "🙂",
                mood: "good",
              },
              {
                color: "yellow",
                icon: "😐",
                mood: "okay",
              },
              {
                color: "orange",
                icon: "🙁",
                mood: "bad",
              },
              {
                color: "red",
                icon: "😞",
                mood: "really_bad",
              },
            ].map((mood, index) => (
              <InteractivePressable key={mood.mood}>
                {/* {!!index && (
                  <View
                    className={`ml-7 h-14 w-0.5 ${tasks[index - 1].isCompleted && mood.isCompleted ? "bg-green-500 dark:bg-green-400" : "bg-border"}`}
                  />
                )} */}
                <View className="flex-row items-center gap-6">
                  <View
                    className={`bg-card h-14 w-14 items-center justify-center rounded-2xl border-2`}
                    style={{ borderColor: twColors[mood.color][500] }}
                  >
                    <Text style={{ fontSize: 24 }}>{mood.icon}</Text>
                  </View>
                  <View>
                    <Text
                      className="text-text text-xl font-semibold"
                      style={{ color: twColors[mood.color][500] }}
                    >
                      {t(mood.mood)}
                    </Text>
                    <Text className="text-text/50 text-base font-normal">
                      {t(mood.mood)}
                    </Text>
                  </View>
                </View>
              </InteractivePressable>
            ))}
          </View>
        </View>
        <View className="border-border border-t-hairline bg-card p-6">
          <Button
            className="self-center"
            label={t("common.save")}
            // onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>
      <View className="pb-safe bg-card" />
    </View>
  );
}
