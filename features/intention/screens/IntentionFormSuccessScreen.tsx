import { Button } from "@/components/ui/Button";
import { useActivityStore } from "@/features/activity/store/activityStore";
import { router } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Confetti } from "react-native-fast-confetti";

export default function IntentionFormSuccessScreen() {
  const { t } = useTranslation();

  const { counters, streak } = useActivityStore();

  const message = useMemo(() => {
    if (counters.intentions === 1) {
      return {
        showConfetti: true,
        emoji: "🎉",
        title:
          "features.intention.screens.IntentionFormSuccessScreen.firstIntention.title",
        description:
          "features.intention.screens.IntentionFormSuccessScreen.firstIntention.description",
      };
    }

    if (streak.state === "streak_restarted") {
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
  }, [counters.intentions, streak.state]);

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
            <Text className="text-text/50 text-center text-base font-normal">
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
