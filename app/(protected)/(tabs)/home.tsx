import { InteractivePressable } from "@/components/InteractivePressable";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { WeeklyProgress } from "@/features/activity/components/WeeklyProgress";
import { useActivityStore } from "@/features/activity/store/activityStore";
import { IntentionGreetingCard } from "@/features/intention/components/IntentionGreetingCard";
import { useTheme } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { streak } = useActivityStore();

  return (
    <View className="pt-safe flex-1 pb-6">
      <View className="h-16 flex-row items-center justify-between  px-6">
        <Link asChild href="/streak">
          <InteractivePressable className="flex-row items-center gap-2">
            <IconSymbol
              color={theme.colors.primary}
              name="flame.fill"
              size={24}
            />
            <Text className="text-primary text-base font-medium">
              {streak.currentStreak}
            </Text>
          </InteractivePressable>
        </Link>
        <Link asChild href="/settings">
          <InteractivePressable>
            <IconSymbol
              color={theme.colors.primary}
              name="gearshape.fill"
              size={24}
            />
          </InteractivePressable>
        </Link>
      </View>
      <View className="flex-1 gap-6 p-6">
        <WeeklyProgress />
        <IntentionGreetingCard />
      </View>
      <ScrollView
        className="flex-grow-0"
        contentContainerClassName="gap-4 px-6"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {[
          {
            label: "app.home.addMoodLogButtonLabel",
            icon: "😊",
            href: "/mood/new",
          },
          {
            label: "app.home.addGratitudeButtonLabel",
            icon: "🙏",
            href: "/gratitude/new",
          },
          {
            label: "app.home.addReflectionButtonLabel",
            icon: "📝",
            href: "/reflection/new",
          },
        ].map((item) => (
          <InteractivePressable
            className="bg-card h-16 flex-row items-center gap-4 rounded-2xl px-4"
            key={item.label}
            onPress={() => router.push(item.href)}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text style={{ fontSize: 16 }}>{t(item.icon)}</Text>
              <Text className="text-text text-lg font-medium">
                {t(item.label)}
              </Text>
            </View>
            <IconSymbol color={theme.colors.primary} name="plus" size={20} />
          </InteractivePressable>
        ))}
      </ScrollView>
    </View>
  );
}
