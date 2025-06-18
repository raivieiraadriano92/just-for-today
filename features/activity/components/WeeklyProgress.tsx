import { InteractivePressable } from "@/components/InteractivePressable";
import { useTheme } from "@react-navigation/native";
import { format, startOfWeek } from "date-fns";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { CircularProgressBase } from "react-native-circular-progress-indicator";
import twColors from "tailwindcss/colors";

const firstDayOfWeek = startOfWeek(new Date());

// Generate an array of dates for the current week starting from the first day of the week
const weekDays = Array.from({ length: 7 }, (_, i) => {
  const date = new Date(firstDayOfWeek);
  date.setDate(date.getDate() + i);
  return {
    day: format(date, "EEEEE"), // First letter of the day (e.g., "M - Mon", "T - Tue")
    date: format(date, "yyyy-MM-dd"), // Format as YYYY-MM-DD
  };
});

export function WeeklyProgress() {
  const theme = useTheme();

  return (
    <View className="bg-card flex-row items-center justify-evenly rounded-2xl p-3">
      {weekDays.map((day, index) => (
        <Link asChild key={index} href={`/summary/${day.date}-1`}>
          <InteractivePressable>
            <CircularProgressBase
              activeStrokeWidth={3}
              inActiveStrokeWidth={3}
              inActiveStrokeOpacity={1}
              // @todo: remove mock value
              value={index === 3 ? 75 : 0}
              radius={20}
              activeStrokeColor={twColors.green[theme.dark ? 400 : 500]}
              // @todo: remove mock value
              inActiveStrokeColor={
                index > 3 ? "transparent" : theme.colors.border
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
