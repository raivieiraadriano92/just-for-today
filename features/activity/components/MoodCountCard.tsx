import { moodTypes } from "@/features/mood/moodTypes";
import { MoodLogRow, MoodType } from "@/features/mood/store/moodLogStore";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { BarChart } from "react-native-svg-charts";
import twColors from "tailwindcss/colors";

type MoodCountCardProps = {
  moodLogRows: MoodLogRow[];
};

function getMoodCountData(logs: MoodLogRow[], isDark = false) {
  const total = logs.length;
  const grouped: Record<string, number> = {};

  logs.forEach(({ mood }) => {
    grouped[mood] = (grouped[mood] || 0) + 1;
  });

  return (Object.entries(grouped) as [MoodType, number][])
    .map(([mood, count]) => ({
      mood,
      value: count,
    }))
    .sort((a, b) => {
      const moodA = moodTypes[a.mood];
      const moodB = moodTypes[b.mood];
      return moodB.value - moodA.value;
    });
}

export function MoodCountCard({ moodLogRows }: MoodCountCardProps) {
  const { t } = useTranslation();

  const theme = useTheme();

  const data = getMoodCountData(moodLogRows).map((item) => ({
    ...item,
    svg: {
      fill: twColors[moodTypes[item.mood].color.token][
        moodTypes[item.mood].color[theme.dark ? "dark" : "light"]
      ],
    },
  }));

  const totalCount = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <View className="flex-1 gap-6 rounded-2xl bg-card p-6">
      <Text className="text-lg font-bold text-primary">
        {t("features.activity.components.MoodCountCard.title")}
      </Text>
      <View style={{ height: 100 }}>
        <BarChart
          animate
          data={data}
          gridMin={0}
          yAccessor={({ item }) => item.value}
          style={{ flex: 1 }}
        />
      </View>
      <View className="flex-row">
        {data.map((item) => (
          <View key={item.mood} className="flex-1 items-center">
            <View className="w-14 items-center gap-1">
              <Text
                className="text-center text-base font-medium text-text"
                style={{
                  color:
                    twColors[moodTypes[item.mood].color.token][
                      moodTypes[item.mood].color[theme.dark ? "dark" : "light"]
                    ],
                }}
              >
                {`${item.value}x`}
              </Text>
              <View
                className={`h-10 w-10 items-center justify-center rounded-2xl border-2 bg-card`}
                style={{
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
                className="text-center text-sm font-medium text-text"
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
      <Text className="text-lg font-bold text-primary">
        {t("features.activity.components.MoodCountCard.totalLogs", {
          count: totalCount,
        })}
      </Text>
    </View>
  );
}
