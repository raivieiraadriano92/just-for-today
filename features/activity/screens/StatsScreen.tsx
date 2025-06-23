import { Button } from "@/components/ui/Button";
import { moodTypesList } from "@/features/mood/moodTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { MoodCountCard } from "../components/MoodCountCard";
import { MoodFlowCard } from "../components/MoodFlowCard";

type FilterType = "week" | "month" | "year";

const filterOptions: FilterType[] = ["week", "month", "year"];

export function StatsScreen() {
  const { t } = useTranslation();

  const moodFlowData = moodTypesList.map((moodType) => ({
    moodType,
    // random integer number between 1 and 5 for demonstration purposes
    value: Math.floor(Math.random() * 5) + 1, // Replace with actual data if available
  }));

  const moodCountData = moodTypesList.map((moodType) => ({
    moodType,
    // random number between 0 and 100 for demonstration purposes
    value: Math.floor(Math.random() * 100), // Replace with actual data if available
  }));

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("week");

  return (
    <View className="flex-1">
      <View className="pt-safe bg-card">
        <View className="border-b-hairline border-border h-16 items-center justify-center px-6">
          <Text className="text-text absolute text-lg font-semibold">
            {t("features.activity.screens.StatsScreen.title")}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerClassName="p-6 gap-6">
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
        <MoodFlowCard data={moodFlowData} />
        <MoodCountCard data={moodCountData} />
      </ScrollView>
    </View>
  );
}
