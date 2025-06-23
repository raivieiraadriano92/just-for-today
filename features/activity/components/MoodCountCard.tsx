import { moodTypes } from "@/features/mood/moodTypes";
import { MoodType } from "@/features/mood/store/moodLogStore";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { BarChart } from "react-native-svg-charts";
import twColors from "tailwindcss/colors";

type MoodCountCardProps = {
  data: {
    moodType: MoodType;
    value: number;
  }[];
};

export function MoodCountCard({ data }: MoodCountCardProps) {
  const { t } = useTranslation();

  const theme = useTheme();

  const _data = data.map((item) => ({
    ...item,
    svg: {
      fill: twColors[moodTypes[item.moodType].color.token][
        moodTypes[item.moodType].color[theme.dark ? "dark" : "light"]
      ],
    },
  }));

  const totalCount = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <View className="bg-card flex-1 gap-6 rounded-2xl p-6">
      <Text className="text-primary text-lg font-bold">
        {t("features.activity.components.MoodCountCard.title")}
      </Text>
      <View style={{ height: 100 }}>
        <BarChart
          animate
          data={_data}
          gridMin={0}
          yAccessor={({ item }) => item.value}
          style={{ flex: 1 }}
        />
      </View>
      <View className="flex-row ">
        {data.map((item) => (
          <View key={item.moodType} className="flex-1 items-center">
            <View className="w-14 items-center gap-1">
              <Text
                className="text-text text-center text-base font-medium"
                style={{
                  color:
                    twColors[moodTypes[item.moodType].color.token][
                      moodTypes[item.moodType].color[
                        theme.dark ? "dark" : "light"
                      ]
                    ],
                }}
              >
                {`${item.value}x`}
              </Text>
              <View
                className={`bg-card h-10 w-10 items-center justify-center rounded-2xl border-2`}
                style={{
                  borderColor:
                    twColors[moodTypes[item.moodType].color.token][
                      moodTypes[item.moodType].color[
                        theme.dark ? "dark" : "light"
                      ]
                    ],
                }}
              >
                <Text style={{ fontSize: 16 }}>
                  {moodTypes[item.moodType].icon}
                </Text>
              </View>
              <Text
                className="text-text text-center text-sm font-medium"
                style={{
                  color:
                    twColors[moodTypes[item.moodType].color.token][
                      moodTypes[item.moodType].color[
                        theme.dark ? "dark" : "light"
                      ]
                    ],
                }}
              >
                {t(`features.moodLog.moodTypes.${item.moodType}.title`)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text className="text-primary text-lg font-bold">
        {t("features.activity.components.MoodCountCard.totalLogs", {
          count: totalCount,
        })}
      </Text>
    </View>
  );
}
