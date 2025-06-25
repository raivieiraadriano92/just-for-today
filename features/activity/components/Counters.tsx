import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type CountersProps = {
  intentions: number;
  moodLogs: number;
  gratitudeLogs: number;
  reflections: number;
};

export function Counters({
  intentions,
  moodLogs,
  gratitudeLogs,
  reflections,
}: CountersProps) {
  const { t } = useTranslation();

  return (
    <View className="gap-3">
      {[
        [
          {
            count: intentions,
            title: "features.activity.screens.StreakScreen.counters.intentions",
          },
          {
            count: moodLogs,
            title: "features.activity.screens.StreakScreen.counters.moodLogs",
          },
        ],
        [
          {
            count: gratitudeLogs,
            title:
              "features.activity.screens.StreakScreen.counters.gratitudeLogs",
          },
          {
            count: reflections,
            title:
              "features.activity.screens.StreakScreen.counters.reflections",
          },
        ],
      ].map((row, rowIndex) => (
        <View className="flex-row gap-3" key={rowIndex}>
          {row.map((item) => (
            <View
              className="flex-1 gap-1 rounded-2xl border-hairline border-border bg-card p-6"
              key={item.title}
            >
              <Text className="text-3xl font-semibold text-text">
                {item.count || "-"}
              </Text>
              <Text className="text-md font-medium text-text/50">
                {t(item.title, { count: item.count })}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
