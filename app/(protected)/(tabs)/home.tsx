import { InteractivePressable } from "@/components/InteractivePressable";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { WeeklyProgress } from "@/features/activity/components/WeeklyProgress";
import { IntentionGreetingCard } from "@/features/intention/components/IntentionGreetingCard";
import { useTheme } from "@react-navigation/native";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View className="pt-safe flex-1">
      <View className="h-16 flex-row items-center justify-between  px-6">
        <InteractivePressable className="flex-row items-center gap-2">
          <IconSymbol
            color={theme.colors.primary}
            name="flame.fill"
            size={24}
          />
          <Text className="text-primary text-base font-medium">1</Text>
        </InteractivePressable>
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
    </View>
  );
}
