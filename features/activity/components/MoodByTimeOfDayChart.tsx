import { moodTypes, moodTypesList } from "@/features/mood/moodTypes";
import { MoodLogRow } from "@/features/mood/store/moodLogStore";
import { useTheme } from "@react-navigation/native";
import { parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { BarChart } from "react-native-svg-charts";
import twColors from "tailwindcss/colors";

type MoodByTimeOfDayChartProps = {
  moodLogRows: MoodLogRow[];
};

const timeSlots = [
  {
    label: "features.activity.components.MoodByTimeOfDayChart.morning",
    start: 5,
    end: 11,
  }, // 5am–11:59am
  {
    label: "features.activity.components.MoodByTimeOfDayChart.afternoon",
    start: 12,
    end: 17,
  }, // 12pm–5:59pm
  {
    label: "features.activity.components.MoodByTimeOfDayChart.evening",
    start: 18,
    end: 21,
  }, // 6pm–9:59pm
  {
    label: "features.activity.components.MoodByTimeOfDayChart.night",
    start: 22,
    end: 4,
  }, // 10pm–4:59am (wraps around)
];

function getMoodByTimeOfDayData(logs: MoodLogRow[], isDark = false) {
  const groups: Record<string, number[]> = {};

  logs.forEach((log) => {
    const date =
      typeof log.datetime === "string"
        ? parseISO(log.datetime)
        : new Date(log.datetime);
    const hour = date.getHours();

    const slot = timeSlots.find(({ start, end, label }) => {
      if (start < end) return hour >= start && hour <= end;
      else return hour >= start || hour <= end; // for Night (22–4)
    });

    if (slot) {
      if (!groups[slot.label]) groups[slot.label] = [];
      groups[slot.label].push(moodTypes[log.mood].value);
    }
  });

  return timeSlots.map(({ label }) => {
    const values = groups[label] || [];
    const avg = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;

    const color = Object.values(moodTypes).find(
      (mood) => mood.value === Math.round(avg),
    )?.color;

    return {
      label,
      value: Math.round(avg),
      svg: {
        fill: color
          ? twColors[color.token][color[isDark ? "dark" : "light"]]
          : "gray",
      },
    };
  });
}

export function MoodByTimeOfDayChart({
  moodLogRows,
}: MoodByTimeOfDayChartProps) {
  const { t } = useTranslation();

  const theme = useTheme();

  const data = getMoodByTimeOfDayData(moodLogRows, theme.dark);

  return (
    <View className="flex-1 gap-6 rounded-2xl bg-card p-6">
      <View className="gap-1">
        <Text className="text-lg font-bold text-primary">
          {t("features.activity.components.MoodByTimeOfDayChart.title")}
        </Text>
        <Text className="text-lg font-normal text-text/60 dark:text-text/80">
          {t("features.activity.components.MoodByTimeOfDayChart.description")}
        </Text>
      </View>
      <View className="flex-row gap-3">
        <View className="justify-between pb-8">
          {moodTypesList.map((moodType) => (
            <View
              className={`items-center justify-center rounded-2xl border-2 bg-card`}
              key={moodType}
              style={{
                height: 36,
                width: 36,
                borderColor:
                  twColors[moodTypes[moodType].color.token][
                    moodTypes[moodType].color[theme.dark ? "dark" : "light"]
                  ],
              }}
            >
              <Text style={{ fontSize: 16 }}>{moodTypes[moodType].icon}</Text>
            </View>
          ))}
        </View>
        <View className="flex-1 gap-3">
          <View style={{ flex: 1, height: 230 }}>
            <BarChart
              animate
              data={data}
              gridMin={0}
              yMax={5}
              yAccessor={({ item }) => item.value}
              style={{ flex: 1 }}
              //   svg={{
              //     fill: "url(#gradient)",
              //   }}
            >
              {/* <Gradient /> */}
            </BarChart>
          </View>
          <View className="flex-row">
            {data.map((item) => (
              <View className="flex-1 items-center" key={item.label}>
                <Text
                  className="text-sm font-medium text-text"
                  style={{
                    color: item.svg.fill,
                    // width: 40,
                    textAlign: "center",
                  }}
                >
                  {t(item.label)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
