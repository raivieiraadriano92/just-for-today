import { Button } from "@/components/ui/Button";
import {
  PROGRESS_MULTIPLIER,
  useActivityStore,
} from "@/features/activity/store/activityStore";
import { requestReview } from "@/utils/requestReview";
import { router } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Confetti } from "react-native-fast-confetti";

export function MoodLogFormSuccessScreen() {
  const { t } = useTranslation();

  const { counters, streak, weeklyProgress } = useActivityStore();

  const isLoading =
    counters.loading || streak.loading || weeklyProgress.loading;

  const message = useMemo(() => {
    if (counters.moodLogs <= 1) {
      return {
        showConfetti: true,
        emoji: "🎉",
        title: t(
          "features.moodLog.screens.MoodLogFormSuccessScreen.firstMoodLog.title",
        ),
        description: t(
          "features.moodLog.screens.MoodLogFormSuccessScreen.firstMoodLog.description",
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
          "features.moodLog.screens.MoodLogFormSuccessScreen.backInStreak.title",
        ),
        description: t(
          "features.moodLog.screens.MoodLogFormSuccessScreen.backInStreak.description",
        ),
      };
    }

    return {
      showConfetti: false,
      emoji: "✨",
      title: t(
        "features.moodLog.screens.MoodLogFormSuccessScreen.inStreak.title",
      ),
      description: t(
        "features.moodLog.screens.MoodLogFormSuccessScreen.inStreak.description",
      ),
    };
  }, [counters.moodLogs, streak.state, t, weeklyProgress.data]);

  const handleBackPress = () => {
    router.back();

    requestReview();
  };

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
        <View className="max-w-sm gap-12">
          <View className="gap-3">
            <Text className="text-center" style={{ fontSize: 48 }}>
              {message.emoji}
            </Text>
            <Text className="text-center text-3xl font-semibold text-text">
              {t(message.title)}
            </Text>
            <Text className="text-center text-lg font-normal text-text/60 dark:text-text/80">
              {t(message.description)}
            </Text>
          </View>
          <Text className="text-center text-xl font-semibold text-text">
            {t(
              "features.moodLog.screens.MoodLogFormSuccessScreen.gratitudeQuestion",
            )}
          </Text>
        </View>
      </View>
      <View className="pb-safe-offset-6 flex-row gap-6 border-t-hairline border-border bg-card p-6">
        <Button
          className="flex-1"
          label={t("common.notNow")}
          onPress={handleBackPress}
          variant="outline"
        />
        <Button
          className="flex-1"
          label={t("common.yes")}
          onPress={() => {
            router.replace("/gratitude/new");
          }}
        />
      </View>
    </>
  );
}
