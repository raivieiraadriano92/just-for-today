import { InteractivePressable } from "@/components/InteractivePressable";
import { useUserStore } from "@/features/user/store/userStore";
import { useTheme } from "@react-navigation/native";
import { isBefore, isToday, parseISO } from "date-fns";
import { router } from "expo-router";
import { Text, View } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import twColors from "tailwindcss/colors";
import { useActivityStore } from "../store/activityStore";

export function WeeklyProgress() {
  const theme = useTheme();

  const { weeklyProgress } = useActivityStore();

  const { user } = useUserStore();

  return (
    <View className="bg-card flex-row items-center justify-evenly rounded-2xl p-3">
      {weeklyProgress.data.map((day, index) => {
        const disableInteraction =
          day.isFuture || isBefore(day.date, user!.createdAt.split("T")[0]);

        return (
          <InteractivePressable
            className="items-center justify-center"
            key={index}
            onPress={() =>
              disableInteraction ? null : router.push(`/summary/${day.date}`)
            }
            hitSlop={10}
          >
            <CircularProgressBase
              activeStrokeWidth={3}
              inActiveStrokeWidth={3}
              inActiveStrokeOpacity={1}
              value={day.progress}
              radius={20}
              activeStrokeColor={twColors.green[theme.dark ? 400 : 500]}
              inActiveStrokeColor={
                disableInteraction ? "transparent" : theme.colors.border
              }
            >
              <Text className="text-text text-center text-base font-semibold">
                {day.day}
              </Text>
            </CircularProgressBase>
            {isToday(parseISO(day.date)) && (
              <View className="bg-primary absolute -bottom-2 h-1 w-1 rounded-full" />
            )}
          </InteractivePressable>
        );
      })}
    </View>
  );
}
