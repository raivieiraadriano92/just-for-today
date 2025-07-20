import { InteractivePressable } from "@/components/InteractivePressable";
import { WeeklyProgress } from "@/features/activity/components/WeeklyProgress";
import { useActivityStore } from "@/features/activity/store/activityStore";
import { IntentionGreetingCard } from "@/features/intention/components/IntentionGreetingCard";
import { useUserStore } from "@/features/user/store/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { Link, router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();

  const theme = useTheme();

  const { counters, streak } = useActivityStore();

  const { isHomeWidgetsPresentationCompleted } = useUserStore();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "ios") {
        const timeout = setTimeout(() => {
          if (
            !isHomeWidgetsPresentationCompleted &&
            counters.intentions === 1
          ) {
            router.push("/widgets");
            return;
          }
        }, 1000);

        return () => clearTimeout(timeout);
      }
    }, [counters.intentions, isHomeWidgetsPresentationCompleted]),
  );

  return (
    <View className="pt-safe flex-1 pb-6">
      <View className="h-16 flex-row items-center justify-between  px-6">
        <Link asChild href="/streak">
          <InteractivePressable className="flex-row items-center gap-2">
            <Ionicons color={theme.colors.primary} name="flame" size={24} />
            <Text className="text-base font-medium text-primary">
              {streak.currentStreak}
            </Text>
          </InteractivePressable>
        </Link>
        <Link asChild href="/settings">
          <InteractivePressable>
            <Ionicons color={theme.colors.primary} name="settings" size={24} />
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
            className="h-16 flex-row items-center gap-4 rounded-2xl bg-card px-4"
            key={item.label}
            onPress={() => router.push(item.href)}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text style={{ fontSize: 16 }}>{t(item.icon)}</Text>
              <Text className="text-lg font-medium text-text">
                {t(item.label)}
              </Text>
            </View>
            <Ionicons color={theme.colors.primary} name="add" size={20} />
          </InteractivePressable>
        ))}
      </ScrollView>
    </View>
  );
}
