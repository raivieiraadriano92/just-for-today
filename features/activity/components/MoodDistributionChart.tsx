import { moodTypes } from "@/features/mood/moodTypes";
import { MoodLogRow, MoodType } from "@/features/mood/store/moodLogStore";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Dimensions, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import twColors from "tailwindcss/colors";

const { width: WINDOW_WIDTH } = Dimensions.get("window");

const CHART_RADIUS = Math.min(WINDOW_WIDTH * 0.35, 200);

type MoodDistributionChartProps = {
  moodLogRows: MoodLogRow[];
};

function getMoodDistributionData(logs: MoodLogRow[], isDark = false) {
  const total = logs.length;
  const grouped: Record<string, number> = {};

  logs.forEach(({ mood }) => {
    grouped[mood] = (grouped[mood] || 0) + 1;
  });

  return (Object.entries(grouped) as [MoodType, number][])
    .map(([mood, count]) => ({
      mood,
      value: Math.round((count / total) * 100),
      color:
        twColors[moodTypes[mood].color.token][
          moodTypes[mood].color[isDark ? "dark" : "light"]
        ],
      label: `${moodTypes[mood]?.icon}`,
      //   label: `${moodTypes[mood]?.icon} ${moodLabels[mood]?.label}`,
    }))
    .sort((a, b) => {
      const moodA = moodTypes[a.mood];
      const moodB = moodTypes[b.mood];
      return moodB.value - moodA.value;
    });
}

export function MoodDistributionChart({
  moodLogRows,
}: MoodDistributionChartProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const pieData = getMoodDistributionData(moodLogRows, theme.dark).map(
    (item) => ({
      ...item,
      value: item.value,
      color: item.color,
      text: `${item.value}%`,
    }),
  );

  return (
    <View className="bg-card flex-1 gap-6 rounded-2xl p-6">
      <Text className="text-primary text-lg font-bold">
        {t("features.activity.components.MoodDistributionChart.title")}
      </Text>
      <View
        className="items-center justify-center"
        style={{ minHeight: CHART_RADIUS * 2 }}
      >
        <PieChart
          isAnimated
          data={pieData}
          radius={CHART_RADIUS}
          showText
          textColor={theme.dark ? theme.colors.background : theme.colors.text}
          textSize={12}
          showValuesAsLabels
        />
      </View>
      <View className="flex-row">
        {pieData.map((item) => (
          <View key={item.mood} className="flex-1 items-center">
            <View className="w-14 items-center gap-1">
              <Text
                className="text-text text-center text-base font-medium"
                style={{
                  color:
                    twColors[moodTypes[item.mood].color.token][
                      moodTypes[item.mood].color[theme.dark ? "dark" : "light"]
                    ],
                }}
              >
                {`${item.value}%`}
              </Text>
              <View
                className={`bg-card items-center justify-center rounded-2xl border-2`}
                style={{
                  height: 36,
                  width: 36,
                  borderColor:
                    twColors[moodTypes[item.mood].color.token][
                      moodTypes[item.mood].color[theme.dark ? "dark" : "light"]
                    ],
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {moodTypes[item.mood].icon}
                </Text>
              </View>
              <Text
                className="text-text text-center text-sm font-medium"
                style={{
                  color:
                    twColors[moodTypes[item.mood].color.token][
                      moodTypes[item.mood].color[theme.dark ? "dark" : "light"]
                    ],
                }}
              >
                {t(`features.moodLog.moodTypes.${item.mood}.title`)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
