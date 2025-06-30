import { Button } from "@/components/ui/Button";
import { drizzleDb } from "@/db/client";
import {
  gratitudeLogsTable,
  intentionsTable,
  moodLogsTable,
  reflectionsTable,
} from "@/db/schema";
import { GratitudeLogRow } from "@/features/gratitude/store/gratitudeStore";
import { IntentionRow } from "@/features/intention/store/todaysIntentionStore";
import { MoodLogRow, MoodType } from "@/features/mood/store/moodLogStore";
import { ReflectionRow } from "@/features/reflection/store/reflectionStore";
import {
  endOfToday,
  format,
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
import { Counters } from "../components/Counters";
import { MoodByTimeOfDayChart } from "../components/MoodByTimeOfDayChart";
import { MoodByWeekdayChart } from "../components/MoodByWeekdayChart";
import { MoodCountCard } from "../components/MoodCountCard";
import { MoodDistributionChart } from "../components/MoodDistributionChart";
import { MoodTrendLineChart } from "../components/MoodTrendLineChart";

type FilterType = "7d" | "month" | "year";

const filterOptions: FilterType[] = ["7d", "month", "year"];

const fetchData = async (filter: FilterType) => {
  const today = endOfToday().toISOString();

  let from = startOfDay(subDays(new Date(), 6)).toISOString();

  if (filter === "month") {
    from = startOfMonth(new Date()).toISOString();
  }

  if (filter === "year") {
    from = startOfYear(new Date()).toISOString();
  }

  const [intentions, moodLogs, gratitudeLogs, reflections] = await Promise.all([
    drizzleDb
      .select()
      .from(intentionsTable)
      .where(
        and(
          gte(intentionsTable.date, format(from, "yyyy-MM-dd")),
          lte(intentionsTable.date, format(today, "yyyy-MM-dd")),
        ),
      ),
    drizzleDb
      .select()
      .from(moodLogsTable)
      .where(
        and(
          gte(moodLogsTable.datetime, from),
          lte(moodLogsTable.datetime, today),
        ),
      ),
    drizzleDb
      .select()
      .from(gratitudeLogsTable)
      .where(
        and(
          gte(gratitudeLogsTable.datetime, from),
          lte(gratitudeLogsTable.datetime, today),
        ),
      ),
    drizzleDb
      .select()
      .from(reflectionsTable)
      .where(
        and(
          gte(reflectionsTable.datetime, from),
          lte(reflectionsTable.datetime, today),
        ),
      ),
  ]);

  return {
    intentions,
    moodLogs: moodLogs.map((row) => ({
      ...row,
      mood: row.mood as MoodType,
      feelings: row.feelings.split(","),
    })),
    gratitudeLogs: gratitudeLogs.map((row) => ({
      ...row,
      images: row.images.split(","),
    })),
    reflections: reflections.map((row) => ({
      ...row,
      images: row.images.split(","),
    })),
  };
};

export function StatsScreen() {
  const { t } = useTranslation();

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("7d");

  const [data, setData] = useState<{
    intentions: IntentionRow[];
    moodLogs: MoodLogRow[];
    gratitudeLogs: GratitudeLogRow[];
    reflections: ReflectionRow[];
  }>({
    intentions: [],
    moodLogs: [],
    gratitudeLogs: [],
    reflections: [],
  });

  useFocusEffect(
    useCallback(() => {
      fetchData(selectedFilter).then(setData);
    }, [selectedFilter]),
  );
  console.log("StatsScreen data", data.moodLogs.length);
  const hasEnoughData =
    new Set(data.moodLogs.map((log) => format(log.datetime, "yyyy-MM-dd")))
      .size >= 3;

  return (
    <View className="flex-1">
      <View className="pt-safe bg-card">
        <View className="h-16 items-center justify-center border-b-hairline border-border px-6">
          <Text className="absolute text-lg font-semibold text-text">
            {t("features.activity.screens.StatsScreen.title")}
          </Text>
        </View>
      </View>
      {hasEnoughData ? (
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
          <Counters
            intentions={data.intentions.length}
            moodLogs={data.moodLogs.length}
            gratitudeLogs={data.gratitudeLogs.length}
            reflections={data.reflections.length}
          />
          <MoodTrendLineChart
            moodLogRows={data.moodLogs}
            period={selectedFilter}
            // key={`MoodTrendLineChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
          />
          <MoodDistributionChart
            moodLogRows={data.moodLogs}
            // key={`MoodDistributionChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
          />
          <MoodCountCard
            moodLogRows={data.moodLogs}
            // key={`MoodCountCard-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
          />
          <MoodByWeekdayChart
            moodLogRows={data.moodLogs}
            // key={`MoodByWeekdayChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
          />
          <MoodByTimeOfDayChart
            moodLogRows={data.moodLogs}
            // key={`MoodByWeekdayChart-${selectedFilter}-${filteredData.length}`} // Key to force re-render on filter change
          />
        </ScrollView>
      ) : (
        <View className="max-w-sm flex-1 items-center justify-center gap-3 self-center p-6">
          <Text className="text-center" style={{ fontSize: 48 }}>
            🧘‍♀️
          </Text>
          <Text className="text-center text-3xl font-semibold text-text">
            {t("features.activity.screens.StatsScreen.emptyState.title")}
          </Text>
          <Text className="text-center text-lg font-normal text-text/60 dark:text-text/80">
            {t("features.activity.screens.StatsScreen.emptyState.description")}
          </Text>
        </View>
      )}
    </View>
  );
}
