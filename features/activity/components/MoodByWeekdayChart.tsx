import { moodTypes, moodTypesList } from "@/features/mood/moodTypes";
import { MoodLogRow } from "@/features/mood/store/moodLogStore";
import { useTheme } from "@react-navigation/native";
import { parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { BarChart } from "react-native-svg-charts";
import twColors from "tailwindcss/colors";

type MoodByWeekdayChartProps = {
  moodLogRows: MoodLogRow[];
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getMoodByWeekdayData(logs: MoodLogRow[], isDark = false) {
  const grouped: Record<number, number[]> = {};

  logs.forEach((log) => {
    const date =
      typeof log.datetime === "string"
        ? parseISO(log.datetime)
        : new Date(log.datetime);
    const weekday = date.getDay(); // 0 = Sun, 6 = Sat
    if (!grouped[weekday]) grouped[weekday] = [];
    grouped[weekday].push(moodTypes[log.mood].value);
  });

  return weekdayLabels.map((label, index) => {
    const moods = grouped[index] || [];
    const avg = moods.length
      ? moods.reduce((a, b) => a + b, 0) / moods.length
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

export function MoodByWeekdayChart({ moodLogRows }: MoodByWeekdayChartProps) {
  const { t } = useTranslation();

  const theme = useTheme();

  const data = getMoodByWeekdayData(moodLogRows, theme.dark);

  return (
    <View className="bg-card flex-1 gap-6 rounded-2xl p-6">
      <Text className="text-primary text-lg font-bold">
        {t("features.activity.components.MoodByWeekdayChart.title")}
      </Text>
      <View className="flex-row gap-3">
        <View className="justify-between pb-8">
          {moodTypesList.map((moodType) => (
            <View
              className={`bg-card items-center justify-center rounded-2xl border-2`}
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
                  className="text-text text-sm font-medium"
                  style={{
                    color: item.svg.fill,
                    width: 40,
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
