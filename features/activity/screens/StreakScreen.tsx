import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { useActivityStore } from "../store/activityStore";

export default function StreakScreen() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { streak } = useActivityStore();

  return (
    <View className="pt-safe flex-1">
      <View className="border-b-hairline border-border h-16 items-center justify-center px-6">
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
      </View>
      <ScrollView
        contentContainerClassName="gap-12 p-6 pb-safe-offset-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center justify-center">
          <Text style={{ fontSize: 48 }}>
            {t(
              `features.activity.screens.StreakScreen.states.${streak.state}.emoji`,
            )}
          </Text>
          <Text className="text-text text-center text-3xl font-semibold leading-relaxed">
            {t(
              `features.activity.screens.StreakScreen.states.${streak.state}.title`,
              {
                currentStreak: streak.currentStreak,
                lastStreak: streak.lastStreak,
              },
            )}
          </Text>
          <Text className="text-text/50 text-center text-base font-normal">
            {t(
              `features.activity.screens.StreakScreen.states.${streak.state}.description`,
              {
                currentStreak: streak.currentStreak,
                lastStreak: streak.lastStreak,
              },
            )}
          </Text>
        </View>
        {(streak.state === "no_streak_yet" ||
          streak.state === "streak_broken") && (
          <Link asChild href="/intention">
            <Button className="self-center" label="Just for Today, I will..." />
          </Link>
        )}
        <View className="gap-3">
          {[
            [
              { count: 4, title: "Days with\nintention" },
              { count: 4, title: "Emotional\ncheck-ins" },
            ],
            [
              { count: 4, title: "Reasons to\nbe thankful" },
              { count: 4, title: "Moments of\nself-reflection" },
            ],
          ].map((row, rowIndex) => (
            <View className="flex-row gap-3" key={rowIndex}>
              {row.map((item) => (
                <View
                  className="border-border border-hairline flex-1 gap-1 rounded-2xl p-6"
                  key={item.title}
                >
                  <Text className="text-text text-3xl font-semibold">
                    {item.count}
                  </Text>
                  <Text className="text-text/50 text-md font-medium">
                    {item.title}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
