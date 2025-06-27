import { InteractivePressable } from "@/components/InteractivePressable";
import { Button } from "@/components/ui/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { Counters } from "../components/Counters";
import { useActivityStore } from "../store/activityStore";

export default function StreakScreen() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { counters, streak } = useActivityStore();

  return (
    <View className="flex-1">
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
        </View>
      </View>
      <ScrollView
        contentContainerClassName="gap-12 p-6 pb-safe-offset-6 pt-12"
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-sm items-center justify-center gap-3 self-center">
          <Text style={{ fontSize: 48 }}>
            {t(
              `features.activity.screens.StreakScreen.states.${streak.state}.emoji`,
            )}
          </Text>
          <Text className="text-center text-3xl font-semibold leading-relaxed text-text">
            {t(
              `features.activity.screens.StreakScreen.states.${streak.state}.title`,
              {
                count: streak.currentStreak,
                currentStreak: streak.currentStreak,
                lastStreak: streak.lastStreak,
              },
            )}
          </Text>
          <Text className="text-center text-lg font-normal text-text/60 dark:text-text/80">
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
            <Button
              className="self-center"
              label={t(
                "features.activity.screens.StreakScreen.intentionButtonLabel",
              )}
            />
          </Link>
        )}
        <Counters
          intentions={counters.intentions}
          moodLogs={counters.moodLogs}
          gratitudeLogs={counters.gratitudeLogs}
          reflections={counters.reflections}
        />
      </ScrollView>
    </View>
  );
}
