import { InteractivePressable } from "@/components/InteractivePressable";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useActivityStore } from "@/features/activity/store/activityStore";
import { useTheme } from "@react-navigation/native";
import { format, isToday, isValid, isYesterday, parseISO } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { Confetti } from "react-native-fast-confetti";

import twColors from "tailwindcss/colors";

export default function ActivitySummaryByDateScreen() {
  const { t } = useTranslation();

  const { date } = useLocalSearchParams<{ date: string }>();

  const dateObj = parseISO(date);

  const isValidDate = isValid(dateObj);

  const theme = useTheme();

  const { weeklyProgress } = useActivityStore();

  const todaysProgress = weeklyProgress.find((day) => day.date === date);

  const title = useMemo(() => {
    if (isToday(dateObj)) {
      return t("common.today");
    } else if (isYesterday(dateObj)) {
      return t("common.yesterday");
    }

    return format(dateObj, "EEEE");
  }, [dateObj, t]);

  const feedbackMessage = useMemo(() => {
    const hasAtLeastOneCompleted =
      !!todaysProgress?.intentionsCount ||
      !!todaysProgress?.moodLogsCount ||
      !!todaysProgress?.gratitudeLogsCount ||
      !!todaysProgress?.reflectionsCount;

    if (todaysProgress?.isCompleted) {
      return {
        emoji: "🎉",
        title:
          "features.activity.screens.ActivitySummaryByDateScreen.status.allCompleted.title",
        description:
          "features.activity.screens.ActivitySummaryByDateScreen.status.allCompleted.description",
      };
    }

    if (hasAtLeastOneCompleted) {
      return {
        emoji: "🌱",
        title:
          "features.activity.screens.ActivitySummaryByDateScreen.status.partialCompleted.title",
        description:
          "features.activity.screens.ActivitySummaryByDateScreen.status.partialCompleted.description",
      };
    }

    if (isToday(dateObj)) {
      return {
        emoji: "✨",
        title:
          "features.activity.screens.ActivitySummaryByDateScreen.status.notCompletedToday.title",
        description:
          "features.activity.screens.ActivitySummaryByDateScreen.status.notCompletedToday.description",
      };
    }

    return {
      emoji: "🫶",
      title:
        "features.activity.screens.ActivitySummaryByDateScreen.status.notCompletedPast.title",
      description:
        "features.activity.screens.ActivitySummaryByDateScreen.status.notCompletedPast.description",
    };
  }, [
    dateObj,
    todaysProgress?.gratitudeLogsCount,
    todaysProgress?.intentionsCount,
    todaysProgress?.isCompleted,
    todaysProgress?.moodLogsCount,
    todaysProgress?.reflectionsCount,
  ]);

  const tasks = useMemo(() => {
    return [
      {
        description:
          "features.activity.screens.ActivitySummaryByDateScreen.tasks.intention.description",
        isCompleted: !!todaysProgress?.intentionsCount,
        title:
          "features.activity.screens.ActivitySummaryByDateScreen.tasks.intention.title",
      },
      {
        description:
          "features.activity.screens.ActivitySummaryByDateScreen.tasks.moodLog.description",
        isCompleted: !!todaysProgress?.moodLogsCount,
        title:
          "features.activity.screens.ActivitySummaryByDateScreen.tasks.moodLog.title",
      },
      {
        description:
          "features.activity.screens.ActivitySummaryByDateScreen.tasks.gratitudeLog.description",
        isCompleted: !!todaysProgress?.gratitudeLogsCount,
        title:
          "features.activity.screens.ActivitySummaryByDateScreen.tasks.gratitudeLog.title",
      },
      {
        description:
          "features.activity.screens.ActivitySummaryByDateScreen.tasks.reflection.description",
        isCompleted: !!todaysProgress?.reflectionsCount,
        title:
          "features.activity.screens.ActivitySummaryByDateScreen.tasks.reflection.title",
      },
    ];
  }, [
    todaysProgress?.gratitudeLogsCount,
    todaysProgress?.intentionsCount,
    todaysProgress?.moodLogsCount,
    todaysProgress?.reflectionsCount,
  ]);

  if (!isValidDate) {
    return (
      <View>
        <Text>Invalid date format. Please use YYYY-MM-DD.</Text>
      </View>
    );
  }

  return (
    <>
      <Confetti
        autoplay={todaysProgress?.isCompleted}
        count={400}
        fallDuration={5000}
        isInfinite={false}
      />
      <View className="flex-1">
        <View className="pt-safe bg-card">
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
            <Text className="text-text absolute text-lg font-semibold">
              {title}
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerClassName="gap-12 p-6 pb-safe-offset-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center justify-center">
            <Text style={{ fontSize: 48 }}>{feedbackMessage.emoji}</Text>
            <Text className="text-text text-center text-3xl font-semibold leading-relaxed">
              {t(feedbackMessage.title)}
            </Text>
            <Text className="text-text/50 text-center text-base font-normal">
              {t(feedbackMessage.description)}
            </Text>
          </View>
          <View>
            {tasks.map((task, index) => (
              <View key={task.title}>
                {!!index && (
                  <View
                    className={`ml-7 h-14 w-0.5 ${tasks[index - 1].isCompleted && task.isCompleted ? "bg-green-500 dark:bg-green-400" : "bg-border"}`}
                  />
                )}
                <View className="flex-row items-center gap-6">
                  <View
                    className={`h-14 w-14 items-center justify-center rounded-2xl border-2 ${task.isCompleted ? "border-green-500 dark:border-green-400" : "border-border"}`}
                  >
                    <IconSymbol
                      color={
                        task.isCompleted
                          ? theme.dark
                            ? twColors.green[400]
                            : twColors.green[500]
                          : theme.colors.border
                      }
                      name={
                        task.isCompleted
                          ? "checkmark.circle.fill"
                          : "x.circle.fill"
                      }
                      size={24}
                    />
                  </View>
                  <View>
                    <Text className="text-text text-xl font-semibold">
                      {t(task.title)}
                    </Text>
                    <Text className="text-text/50 text-base font-normal">
                      {t(task.description)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}
