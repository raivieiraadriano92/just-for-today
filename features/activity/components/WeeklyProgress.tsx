import { InteractivePressable } from "@/components/InteractivePressable";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import twColors from "tailwindcss/colors";
import { useActivityStore } from "../store/activityStore";

export function WeeklyProgress() {
  const theme = useTheme();

  const { weeklyProgress } = useActivityStore();

  return (
    <View className="bg-card flex-row items-center justify-evenly rounded-2xl p-3">
      {weeklyProgress.map((day, index) => (
        <Link asChild key={index} href={`/summary/${day.date}-1`}>
          <InteractivePressable>
            <CircularProgressBase
              activeStrokeWidth={3}
              inActiveStrokeWidth={3}
              inActiveStrokeOpacity={1}
              value={day.value}
              radius={20}
              activeStrokeColor={twColors.green[theme.dark ? 400 : 500]}
              inActiveStrokeColor={
                day.isFuture ? "transparent" : theme.colors.border
              }
            >
              <Text className="text-text text-center text-base font-semibold">
                {day.day}
              </Text>
            </CircularProgressBase>
          </InteractivePressable>
        </Link>
      ))}
    </View>
  );
}
