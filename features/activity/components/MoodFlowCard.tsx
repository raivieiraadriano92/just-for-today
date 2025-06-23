import { moodTypes, moodTypesList } from "@/features/mood/moodTypes";
import { MoodType } from "@/features/mood/store/moodLogStore";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { Grid, LineChart } from "react-native-svg-charts";
import twColors from "tailwindcss/colors";

type MoodFlowCardProps = {
  data: {
    moodType: MoodType;
    value: number;
  }[];
};

export function MoodFlowCard({}: MoodFlowCardProps) {
  const { t } = useTranslation();

  const theme = useTheme();

  const data = [
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 3,
      date: "test",
    },
    {
      value: 4,
      date: "test",
    },
    {
      value: 5,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 3,
      date: "test",
    },
    {
      value: 4,
      date: "test",
    },
    {
      value: 5,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 3,
      date: "test",
    },
    {
      value: 4,
      date: "test",
    },
    {
      value: 5,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 3,
      date: "test",
    },
    {
      value: 4,
      date: "test",
    },
    {
      value: 5,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 3,
      date: "test",
    },
    {
      value: 4,
      date: "test",
    },
    {
      value: 5,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 3,
      date: "test",
    },
    {
      value: 4,
      date: "test",
    },
    {
      value: 5,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 3,
      date: "test",
    },
    {
      value: 4,
      date: "test",
    },
    {
      value: 5,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
    {
      value: 3,
      date: "test",
    },
    {
      value: 4,
      date: "test",
    },
    {
      value: 5,
      date: "test",
    },
    {
      value: 1,
      date: "test",
    },
    {
      value: 2,
      date: "test",
    },
  ];

  const Gradient = (props) => {
    return (
      <Defs key={props.index}>
        <LinearGradient
          id={"gradient"}
          x1={"0%"}
          y1={"0%"}
          x2={"0%"}
          y2={"100%"}
        >
          {moodTypesList
            // .sort((a, b) => moodTypes[b].value - moodTypes[a].value)
            .map((moodType, index) => {
              return (
                <Stop
                  key={moodType}
                  offset={`${(100 / moodTypesList.length) * index}%`}
                  stopColor={
                    twColors[moodTypes[moodType].color.token][
                      moodTypes[moodType].color[theme.dark ? "dark" : "light"]
                    ]
                  }
                />
              );
            })}
        </LinearGradient>
      </Defs>
    );
  };

  return (
    <View className="bg-card flex-1 gap-6 rounded-2xl p-6">
      <Text className="text-primary text-lg font-bold">
        {t("features.activity.components.MoodFlowCard.title")}
      </Text>
      <View className="flex-row">
        <View className="justify-between">
          {moodTypesList.map((moodType) => (
            <View
              className={`bg-card h-10 w-10 items-center justify-center rounded-2xl border-2`}
              key={moodType}
              style={{
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
        <LineChart
          // contentInset={{ top: 15, bottom: 15 }}
          // curve={shape.curveLinear}
          style={{ flex: 1, height: 200 }}
          data={data}
          yAccessor={({ item }) => item.value}
          // contentInset={{ top: 20, bottom: 20 }}
          svg={{
            strokeWidth: 2,
            stroke: "url(#gradient)",
          }}
        >
          <Grid />
          <Gradient />
        </LineChart>
      </View>
      {/* <AreaChart
        style={{ height: 100 }}
        data={data}
        contentInset={{ top: 7, bottom: 8 }}
        yAccessor={({ item }) => item.value}
        curve={shape.curveNatural}
        svg={{ fill: "url(#gradient)" }}
      >
        <Grid />
        <Gradient />
      </AreaChart> */}
    </View>
  );
}
