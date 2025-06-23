import { moodTypesList } from "@/features/mood/moodTypes";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { MoodCountCard } from "../components/MoodCountCard";

export function StatsScreen() {
  const { t } = useTranslation();

  const moodCountData = moodTypesList.map((moodType) => ({
    moodType,
    // random number between 0 and 100 for demonstration purposes
    value: Math.floor(Math.random() * 100), // Replace with actual data if available
  }));

  return (
    <View className="flex-1">
      <View className="pt-safe bg-card">
        <View className="border-b-hairline border-border h-16 items-center justify-center px-6">
          <Text className="text-text absolute text-lg font-semibold">
            {t("features.activity.screens.stats.title")}
          </Text>
        </View>
      </View>
      <ScrollView contentContainerClassName="p-6">
        <MoodCountCard data={moodCountData} />
      </ScrollView>
    </View>
  );
}
