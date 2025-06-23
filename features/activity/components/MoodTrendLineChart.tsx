import { moodTypes, moodTypesList } from "@/features/mood/moodTypes";
import { MoodLogRow } from "@/features/mood/store/moodLogStore";
import { useTheme } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";
import twColors from "tailwindcss/colors";

type MoodTrendLineChartProps = {
  moodLogRows: MoodLogRow[];
  period: Period;
};

type Period = "7d" | "month" | "year";

function getMoodTrendData(logs: MoodLogRow[], period: Period) {
  const groups: Record<string, number[]> = {};

  logs.forEach((log) => {
    const date = parseISO(log.datetime);

    let label: string;
    switch (period) {
      case "7d":
        label = format(date, "dd/MM");
        break;
      case "month":
        label = format(date, "dd/MM");
        break;
      case "year":
        label = format(date, "MMM");
        break;
      default:
        label = format(date, "dd/MM");
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(moodTypes[log.mood].value);
  });

  return Object.entries(groups).map(([label, values]) => ({
    label,
    value: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
  }));
}

export function MoodTrendLineChart({
  moodLogRows,
  period,
}: MoodTrendLineChartProps) {
  const data = getMoodTrendData(moodLogRows, period);

  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <View className="bg-card flex-1 gap-6 rounded-2xl p-6">
      <Text className="text-primary text-lg font-bold">
        {t("features.activity.components.MoodTrendLineChart.title")}
      </Text>
      <View className="flex-row">
        <View className="justify-start gap-1 pt-10">
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
        <View className="flex-1 overflow-hidden">
          <LineChart
            isAnimated
            initialSpacing={0}
            yAxisColor={theme.colors.border}
            xAxisColor={theme.colors.border}
            rulesColor={theme.colors.border}
            endSpacing={0}
            endReachedOffset={0}
            data={data}
            thickness={5}
            color={theme.colors.border}
            hideDataPoints={false}
            dataPointsColor={theme.colors.primary}
            curved
            stepHeight={40}
            maxValue={6}
            stepValue={1}
            yAxisTextStyle={{ fontSize: 16 }}
            // yAxisLabelTexts={[" ", " ", " ", " ", " ", " ", " "]}
            hideYAxisText
            label
            spacing={80}
            xAxisLabelTextStyle={{
              marginLeft: 25,
              fontSize: 12,
              color: theme.colors.text,
              fontWeight: "500",
              // rotateLabel: true
            }}
            areaChart
            areaGradientId="ag" // same as the id passed in <LinearGradient> below
            areaGradientComponent={() => (
              <LinearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                {moodTypesList.map((moodType, index) => (
                  <Stop
                    key={moodType}
                    offset={`${(100 / moodTypesList.length) * index}%`}
                    stopColor={
                      twColors[moodTypes[moodType].color.token][
                        moodTypes[moodType].color[theme.dark ? "dark" : "light"]
                      ]
                    }
                  />
                ))}
              </LinearGradient>
            )}
          />
        </View>
      </View>
    </View>
  );
}
