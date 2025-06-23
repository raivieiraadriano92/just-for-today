import { Button } from "@/components/ui/Button";
import { format, isAfter, parseISO } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { MoodCountCard } from "../components/MoodCountCard";
import { MoodDistributionChart } from "../components/MoodDistributionChart";
import { MoodTrendLineChart } from "../components/MoodTrendLineChart";

type FilterType = "7d" | "month" | "year";

const filterOptions: FilterType[] = ["7d", "month", "year"];

const mockData = [
  {
    datetime: "2025-06-23T09:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-22T20:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-06-22T22:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-21T17:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-06-21T07:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-06-21T18:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-06-20T19:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-06-20T09:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-06-20T20:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-06-19T17:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-06-18T09:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-17T17:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-17T09:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-06-16T17:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-16T13:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-16T13:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-06-15T17:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-14T13:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-13T15:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-06-13T16:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-13T08:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-12T18:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-06-11T20:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-11T10:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-11T16:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-10T06:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-06-09T16:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-06-09T22:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-09T07:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-08T07:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-06-08T22:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-07T10:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-06T10:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-05T06:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-06-04T07:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-06-04T08:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-06-04T12:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-03T09:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-06-03T15:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-06-03T20:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-06-02T06:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-06-01T08:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-06-01T08:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-05-31T17:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-05-31T19:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-05-30T06:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-05-30T22:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-05-29T18:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-05-29T08:00:00",
    mood: "really_bad",
    // value: 1,
  },
  {
    datetime: "2025-05-29T15:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-05-28T18:00:00",
    mood: "really_good",
    // value: 5,
  },
  {
    datetime: "2025-05-28T20:00:00",
    mood: "okay",
    // value: 3,
  },
  {
    datetime: "2025-05-28T12:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-05-27T06:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-05-27T10:00:00",
    mood: "bad",
    // value: 2,
  },
  {
    datetime: "2025-05-26T17:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-05-25T07:00:00",
    mood: "good",
    // value: 4,
  },
  {
    datetime: "2025-05-25T12:00:00",
    mood: "bad",
    // value: 2,
  },
].sort(
  (a, b) => parseISO(a.datetime).getTime() - parseISO(b.datetime).getTime(),
);

export function StatsScreen() {
  const { t } = useTranslation();

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("7d");

  const filteredData = mockData.filter((log) => {
    const logDate = parseISO(log.datetime);
    const today = new Date();

    switch (selectedFilter) {
      case "7d":
        // return logDate >= new Date(today.setDate(today.getDate() - 7));
        return isAfter(logDate, new Date(today.setDate(today.getDate() - 6)));
      case "month":
        // return logDate >= new Date(today.setMonth(today.getMonth() - 1));
        return format(logDate, "MM/yyyy") === format(today, "MM/yyyy");
      case "year":
        // return logDate >= new Date(today.setFullYear(today.getFullYear() - 1));
        return format(logDate, "yyyy") === format(today, "yyyy");
      default:
        return true;
    }
  });

  return (
    <View className="flex-1">
      <View className="pt-safe bg-card">
        <View className="border-b-hairline border-border h-16 items-center justify-center px-6">
          <Text className="text-text absolute text-lg font-semibold">
            {t("features.activity.screens.StatsScreen.title")}
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerClassName="p-6 gap-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-center">
          {filterOptions.map((option) => (
            <Button
              key={option}
              label={t(
                `features.activity.screens.StatsScreen.filters.${option}`,
              )}
              onPress={() => setSelectedFilter(option)}
              variant={selectedFilter === option ? "solid" : "ghost"}
            />
          ))}
        </View>
        <MoodTrendLineChart
          moodLogRows={filteredData}
          period={selectedFilter}
          key={`MoodTrendLineChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
        />
        <MoodDistributionChart
          moodLogRows={filteredData}
          key={`MoodDistributionChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
        />
        <MoodCountCard
          moodLogRows={filteredData}
          key={`MoodCountCard-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
        />
      </ScrollView>
    </View>
  );
}
