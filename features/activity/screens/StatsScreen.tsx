import { Button } from "@/components/ui/Button";
import { drizzleDb } from "@/db/client";
import { moodLogsTable } from "@/db/schema";
import { MoodLogRow, MoodType } from "@/features/mood/store/moodLogStore";
import {
  endOfToday,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
} from "date-fns";
import { and, gte, lte } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { MoodByTimeOfDayChart } from "../components/MoodByTimeOfDayChart";
import { MoodByWeekdayChart } from "../components/MoodByWeekdayChart";
import { MoodCountCard } from "../components/MoodCountCard";
import { MoodDistributionChart } from "../components/MoodDistributionChart";
import { MoodTrendLineChart } from "../components/MoodTrendLineChart";

type FilterType = "7d" | "month" | "year";

const filterOptions: FilterType[] = ["7d", "month", "year"];

const fetchMoodLogs = async (filter: FilterType) => {
  const today = endOfToday().toISOString();

  let from = startOfDay(subDays(new Date(), 6)).toISOString();

  if (filter === "month") {
    from = startOfMonth(new Date()).toISOString();
  }

  if (filter === "year") {
    from = startOfYear(new Date()).toISOString();
  }

  const rows = await drizzleDb
    .select()
    .from(moodLogsTable)
    .where(
      and(
        gte(moodLogsTable.datetime, from),
        lte(moodLogsTable.datetime, today),
      ),
    );

  return rows.map((row) => ({
    ...row,
    mood: row.mood as MoodType,
    feelings: row.feelings.split(","),
  }));
};

export function StatsScreen() {
  const { t } = useTranslation();

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("7d");

  const [moodLogRows, setMoodLogRows] = useState<MoodLogRow[]>([]);

  // const filteredData = mockData.filter((log) => {
  //   const logDate = parseISO(log.datetime);
  //   const today = new Date();

  //   switch (selectedFilter) {
  //     case "7d":
  //       // return logDate >= new Date(today.setDate(today.getDate() - 7));
  //       return isAfter(logDate, new Date(today.setDate(today.getDate() - 6)));
  //     case "month":
  //       // return logDate >= new Date(today.setMonth(today.getMonth() - 1));
  //       return format(logDate, "MM/yyyy") === format(today, "MM/yyyy");
  //     case "year":
  //       // return logDate >= new Date(today.setFullYear(today.getFullYear() - 1));
  //       return format(logDate, "yyyy") === format(today, "yyyy");
  //     default:
  //       return true;
  //   }
  // });

  useFocusEffect(
    useCallback(() => {
      fetchMoodLogs(selectedFilter).then(setMoodLogRows);
    }, [selectedFilter]),
  );

  return (
    <View className="flex-1">
      <View className="pt-safe bg-card">
        <View className="h-16 items-center justify-center border-b-hairline border-border px-6">
          <Text className="absolute text-lg font-semibold text-text">
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
          moodLogRows={moodLogRows}
          period={selectedFilter}
          // key={`MoodTrendLineChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
        />
        <MoodDistributionChart
          moodLogRows={moodLogRows}
          // key={`MoodDistributionChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
        />
        <MoodCountCard
          moodLogRows={moodLogRows}
          // key={`MoodCountCard-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
        />
        <MoodByWeekdayChart
          moodLogRows={moodLogRows}
          // key={`MoodByWeekdayChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
        />
        <MoodByTimeOfDayChart
          moodLogRows={moodLogRows}
          // key={`MoodByWeekdayChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
        />
      </ScrollView>
    </View>
  );
}
