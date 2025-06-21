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

export default function IntentionFormSuccessScreen() {
  const { t } = useTranslation();

  const { counters, streak, weeklyProgress } = useActivityStore();

  const isLoading =
    counters.loading || streak.loading || weeklyProgress.loading;

  const message = useMemo(() => {
    if (counters.intentions <= 1) {
      return {
        showConfetti: true,
        emoji: "🎉",
        title:
          "features.intention.screens.IntentionFormSuccessScreen.firstIntention.title",
        description:
          "features.intention.screens.IntentionFormSuccessScreen.firstIntention.description",
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
        title:
          "features.intention.screens.IntentionFormSuccessScreen.backInStreak.title",
        description:
          "features.intention.screens.IntentionFormSuccessScreen.backInStreak.description",
      };
    }

    return {
      showConfetti: false,
      emoji: "🌿",
      title:
        "features.intention.screens.IntentionFormSuccessScreen.inStreak.title",
      description:
        "features.intention.screens.IntentionFormSuccessScreen.inStreak.description",
    };
  }, [counters.intentions, streak.state, weeklyProgress.data]);

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
        <View className="gap-12">
          <View className="gap-3">
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
          <Text className="text-text text-center text-xl font-semibold">
            {t(
              "features.intention.screens.IntentionFormSuccessScreen.moodQuestion",
            )}
          </Text>
        </View>
      </View>
      <View className="border-t-hairline border-border bg-card pb-safe-offset-6 flex-row gap-6 p-6">
        <Button
          className="flex-1"
          label={t("common.notNow")}
          onPress={router.back}
          variant="outline"
        />
        <Button
          className="flex-1"
          label={t("common.yes")}
          onPress={() => {
            router.replace("/mood/new");
          }}
        />
      </View>
    </>
  );
}
