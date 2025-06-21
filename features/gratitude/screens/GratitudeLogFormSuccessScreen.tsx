import { Button } from "@/components/ui/Button";
import {
  PROGRESS_MULTIPLIER,
  useActivityStore,
} from "@/features/activity/store/activityStore";
import { router } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Confetti } from "react-native-fast-confetti";

export function GratitudeLogFormSuccessScreen() {
  const { t } = useTranslation();

  const { counters, streak, weeklyProgress } = useActivityStore();

  const isLoading =
    counters.loading || streak.loading || weeklyProgress.loading;

  const message = useMemo(() => {
    if (counters.gratitudeLogs <= 1) {
      return {
        showConfetti: true,
        emoji: "🎉",
        title: t(
          "features.gratitudeLog.screens.GratitudeLogFormSuccessScreen.firstGratitudeLog.title",
        ),
        description: t(
          "features.gratitudeLog.screens.GratitudeLogFormSuccessScreen.firstGratitudeLog.description",
        ),
      };
    }

    const todaysProgress = weeklyProgress.data.find(
      (progress) => progress.date === new Date().toISOString().split("T")[0],
    );

    if (
      streak.state === "streak_restarted" &&
      (todaysProgress?.progress || 0) <= PROGRESS_MULTIPLIER
    ) {
      return {
        showConfetti: true,
        emoji: "🎉",
        title: t(
          "features.gratitudeLog.screens.GratitudeLogFormSuccessScreen.backInStreak.title",
        ),
        description: t(
          "features.gratitudeLog.screens.GratitudeLogFormSuccessScreen.backInStreak.description",
        ),
      };
    }

    return {
      showConfetti: false,
      emoji: "🙏",
      title: t(
        "features.gratitudeLog.screens.GratitudeLogFormSuccessScreen.inStreak.title",
      ),
      description: t(
        "features.gratitudeLog.screens.GratitudeLogFormSuccessScreen.inStreak.description",
      ),
    };
  }, [counters.gratitudeLogs, streak.state, t, weeklyProgress.data]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <>
      <Confetti
        autoplay={message.showConfetti}
        count={400}
        fallDuration={5000}
        isInfinite={false}
      />
      <View className="pt-safe-offset-6 flex-1 items-center justify-center p-6">
        <View className="max-w-sm gap-3">
          <Text className="text-center" style={{ fontSize: 48 }}>
            {message.emoji}
          </Text>
          <Text className="text-text text-center text-3xl font-semibold">
            {t(message.title)}
          </Text>
          <Text className="text-text/60 dark:text-text/80 text-center text-lg font-normal">
            {t(message.description)}
          </Text>
        </View>
      </View>
      <View className="border-t-hairline border-border bg-card pb-safe-offset-6 items-center p-6">
        <Button
          label={t(
            "features.gratitudeLog.screens.GratitudeLogFormSuccessScreen.buttonLabel",
          )}
          onPress={router.back}
        />
      </View>
    </>
  );
}
